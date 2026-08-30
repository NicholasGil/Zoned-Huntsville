-- Section 8 schema. Tiers are guide | toolkit | call.
-- Checkout amounts 79 / 149 / 349 map onto those three values in the webhook.

create extension if not exists pgcrypto;

create table public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id),
  email text not null,
  tier text not null check (tier in ('guide', 'toolkit', 'call')),
  stripe_session_id text unique not null,
  stripe_payment_intent text,
  purchased_at timestamptz not null default now(),
  refunded_at timestamptz
);

create index entitlements_user_id_idx on public.entitlements (user_id);
create index entitlements_email_idx on public.entitlements (lower(email));
create index entitlements_tier_idx on public.entitlements (tier);
create index entitlements_purchased_at_idx on public.entitlements (purchased_at);
create unique index entitlements_payment_intent_idx
  on public.entitlements (stripe_payment_intent)
  where stripe_payment_intent is not null;

create table public.processed_events (
  event_id text primary key,
  processed_at timestamptz not null default now()
);

create table public.facts (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null
    check (entity_type in ('district', 'school', 'program', 'policy')),
  entity_slug text not null,
  field text not null,
  value text not null,
  source_url text not null,
  verified_at date not null,
  verification_method text not null
    check (verification_method in ('official_page', 'phone', 'secondary')),
  notes text
);

create index facts_verified_at_idx on public.facts (verified_at);
create index facts_entity_idx on public.facts (entity_type, entity_slug);
create unique index facts_entity_field_idx on public.facts (entity_type, entity_slug, field);

create table public.corrections (
  id uuid primary key default gen_random_uuid(),
  fact_id uuid references public.facts (id),
  reporter_email text,
  message text not null,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index corrections_created_at_idx on public.corrections (created_at);
create index corrections_fact_id_idx on public.corrections (fact_id);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  source text,
  created_at timestamptz not null default now()
);

create index leads_email_idx on public.leads (lower(email));

create view public.stale_facts
with (security_invoker = true) as
select *
from public.facts
where verified_at < (current_date - 90);

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.jwt_email()
returns text
language sql
stable
as $$
  select lower(coalesce(auth.jwt() ->> 'email', ''));
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false);
$$;

create or replace function public.has_guide_access()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.entitlements e
    where e.refunded_at is null
      and e.tier in ('guide', 'toolkit', 'call')
      and (
        e.user_id = auth.uid()
        or lower(e.email) = public.jwt_email()
      )
  );
$$;

create or replace function public.has_toolkit_access()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.entitlements e
    where e.refunded_at is null
      and e.tier in ('toolkit', 'call')
      and (
        e.user_id = auth.uid()
        or lower(e.email) = public.jwt_email()
      )
  );
$$;

create or replace function public.call_month_usage()
returns table (capacity integer, bookings integer, remaining integer)
language sql
stable
security definer
set search_path = public
as $$
  select
    4,
    count(*)::integer,
    (4 - count(*))::integer
  from public.entitlements
  where tier = 'call'
    and refunded_at is null
    and purchased_at >= date_trunc('month', timezone('utc', now()))
    and purchased_at < date_trunc('month', timezone('utc', now())) + interval '1 month';
$$;

create or replace function public.link_my_entitlements()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  user_email text := public.jwt_email();
begin
  if uid is null or length(user_email) = 0 then
    return;
  end if;

  update public.entitlements
  set user_id = uid
  where user_id is null
    and lower(email) = user_email;
end;
$$;

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------

revoke all on table public.entitlements from public, anon, authenticated;
revoke all on table public.processed_events from public, anon, authenticated;
revoke all on table public.facts from public, anon, authenticated;
revoke all on table public.corrections from public, anon, authenticated;
revoke all on table public.leads from public, anon, authenticated;
revoke all on table public.stale_facts from public, anon, authenticated;

grant usage on schema public to anon, authenticated, service_role;

grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant execute on all functions in schema public to service_role;

grant select on table public.entitlements to authenticated;
grant select on table public.facts to authenticated;
grant select on table public.stale_facts to authenticated;
grant insert (fact_id, reporter_email, message) on table public.corrections to anon, authenticated;
grant select on table public.corrections to authenticated;
grant insert (email, source) on table public.leads to anon, authenticated;
grant select on table public.leads to authenticated;

grant execute on function public.call_month_usage() to anon, authenticated;
grant execute on function public.link_my_entitlements() to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.has_guide_access() to authenticated;
grant execute on function public.has_toolkit_access() to authenticated;
grant execute on function public.jwt_email() to authenticated, anon;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.entitlements enable row level security;
alter table public.processed_events enable row level security;
alter table public.facts enable row level security;
alter table public.corrections enable row level security;
alter table public.leads enable row level security;

create policy entitlements_select_own
  on public.entitlements
  for select
  to authenticated
  using (
    user_id = auth.uid()
    or lower(email) = public.jwt_email()
  );

create policy facts_select_entitled
  on public.facts
  for select
  to authenticated
  using (public.has_guide_access() or public.is_admin());

create policy corrections_insert_anyone
  on public.corrections
  for insert
  to anon, authenticated
  with check (true);

create policy corrections_select_admin
  on public.corrections
  for select
  to authenticated
  using (public.is_admin());

create policy leads_insert_anyone
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

create policy leads_select_admin
  on public.leads
  for select
  to authenticated
  using (public.is_admin());
