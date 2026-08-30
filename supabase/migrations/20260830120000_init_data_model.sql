-- Section 8: schema, RLS, and derived entitlements.
-- Remaining call slots are capacity - bookings on an existing month row.
-- Do not display a remaining number when no row exists.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now(),
  is_admin boolean not null default false
);

create index profiles_email_idx on public.profiles (lower(email));

create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  email text not null,
  stripe_checkout_session_id text not null,
  stripe_payment_intent_id text,
  tier text not null check (tier in ('79', '149', '349')),
  status text not null check (status in ('pending', 'paid', 'refunded', 'failed')),
  created_at timestamptz not null default now(),
  unique (stripe_checkout_session_id),
  unique (stripe_payment_intent_id)
);

create index purchases_user_id_idx on public.purchases (user_id);
create index purchases_email_idx on public.purchases (lower(email));
create index purchases_status_idx on public.purchases (status);

-- One row per buyer email. Flags are written from paid purchases; 149 and 349 include lower tiers.
create table public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  email text not null unique,
  has_guide boolean not null default false,
  has_toolkit boolean not null default false,
  has_call boolean not null default false,
  updated_at timestamptz not null default now()
);

create index entitlements_user_id_idx on public.entitlements (user_id);

create table public.processed_events (
  event_id text primary key,
  processed_at timestamptz not null default now()
);

create table public.call_slots (
  month date primary key,
  capacity integer not null default 4 check (capacity >= 0),
  bookings integer not null default 0 check (bookings >= 0),
  remaining integer generated always as (capacity - bookings) stored,
  constraint call_slots_bookings_within_capacity check (bookings <= capacity)
);

create table public.call_bookings (
  id uuid primary key default gen_random_uuid(),
  month date not null references public.call_slots (month) on delete restrict,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, month)
);

create index call_bookings_month_idx on public.call_bookings (month);
create index call_bookings_user_id_idx on public.call_bookings (user_id);

create table public.districts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  website_url text,
  created_at timestamptz not null default now()
);

create table public.schools (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  district_id uuid references public.districts (id) on delete set null,
  kind text not null check (kind in ('public', 'private', 'magnet', 'specialty')),
  website_url text,
  created_at timestamptz not null default now()
);

create index schools_district_id_idx on public.schools (district_id);

create table public.programs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  school_id uuid references public.schools (id) on delete set null,
  district_id uuid references public.districts (id) on delete set null,
  created_at timestamptz not null default now()
);

create index programs_school_id_idx on public.programs (school_id);
create index programs_district_id_idx on public.programs (district_id);

create table public.modules (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  sort_order integer not null unique,
  created_at timestamptz not null default now()
);

create table public.facts (
  id uuid primary key default gen_random_uuid(),
  subject text not null check (subject in ('district', 'school', 'program', 'policy', 'deadline', 'other')),
  subject_key text not null,
  label text not null,
  value text not null,
  source_url text not null,
  verified_at timestamptz not null,
  verification_method text not null
    check (verification_method in ('official_page', 'phone', 'secondary')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index facts_verified_at_idx on public.facts (verified_at);
create index facts_subject_key_idx on public.facts (subject, subject_key);
create unique index facts_subject_label_idx on public.facts (subject, subject_key, label);

create table public.corrections (
  id uuid primary key default gen_random_uuid(),
  page_path text not null,
  fact_id uuid references public.facts (id) on delete set null,
  reporter_email text,
  message text not null,
  created_at timestamptz not null default now(),
  emailed_at timestamptz
);

create index corrections_created_at_idx on public.corrections (created_at);
create index corrections_fact_id_idx on public.corrections (fact_id);

create view public.stale_facts
with (security_invoker = true) as
select *
from public.facts
where verified_at < now() - interval '90 days';

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger facts_set_updated_at
  before update on public.facts
  for each row
  execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select p.is_admin from public.profiles p where p.id = auth.uid()),
    false
  );
$$;

create or replace function public.has_paid_guide()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.purchases p
    where p.status = 'paid'
      and p.tier in ('79', '149', '349')
      and (
        p.user_id = auth.uid()
        or lower(p.email) = (
          select lower(pr.email) from public.profiles pr where pr.id = auth.uid()
        )
      )
  );
$$;

create or replace function public.has_paid_toolkit()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.purchases p
    where p.status = 'paid'
      and p.tier in ('149', '349')
      and (
        p.user_id = auth.uid()
        or lower(p.email) = (
          select lower(pr.email) from public.profiles pr where pr.id = auth.uid()
        )
      )
  );
$$;

create or replace function public.link_purchases_for_email(uid uuid, user_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if uid is null or user_email is null or length(trim(user_email)) = 0 then
    return;
  end if;

  update public.purchases
  set user_id = uid
  where user_id is null
    and lower(email) = lower(trim(user_email));

  update public.entitlements
  set user_id = uid
  where user_id is null
    and lower(email) = lower(trim(user_email));
end;
$$;

create or replace function public.link_my_purchases()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  user_email text;
begin
  if uid is null then
    return;
  end if;

  insert into public.profiles (id, email)
  select u.id, lower(coalesce(u.email, ''))
  from auth.users u
  where u.id = uid
  on conflict (id) do update
    set email = excluded.email;

  select p.email into user_email from public.profiles p where p.id = uid;
  perform public.link_purchases_for_email(uid, user_email);
end;
$$;

create or replace function public.sync_entitlements_from_purchases()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_email text;
begin
  target_email := lower(trim(coalesce(new.email, old.email, '')));
  if length(target_email) = 0 then
    return coalesce(new, old);
  end if;

  insert into public.entitlements (
    email,
    user_id,
    has_guide,
    has_toolkit,
    has_call,
    updated_at
  )
  select
    target_email,
    coalesce(
      max(p.user_id),
      (select pr.id from public.profiles pr where lower(pr.email) = target_email limit 1)
    ),
    coalesce(bool_or(p.status = 'paid' and p.tier in ('79', '149', '349')), false),
    coalesce(bool_or(p.status = 'paid' and p.tier in ('149', '349')), false),
    coalesce(bool_or(p.status = 'paid' and p.tier = '349'), false),
    now()
  from public.purchases p
  where lower(p.email) = target_email
  on conflict (email) do update
    set
      user_id = coalesce(excluded.user_id, public.entitlements.user_id),
      has_guide = excluded.has_guide,
      has_toolkit = excluded.has_toolkit,
      has_call = excluded.has_call,
      updated_at = now();

  return coalesce(new, old);
end;
$$;

create trigger purchases_sync_entitlements
  after insert or update of email, user_id, tier, status on public.purchases
  for each row
  execute function public.sync_entitlements_from_purchases();

create or replace function public.sync_call_slot_bookings()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_month date;
begin
  target_month := coalesce(new.month, old.month);

  update public.call_slots
  set bookings = (
    select count(*)::integer from public.call_bookings b where b.month = target_month
  )
  where month = target_month;

  return coalesce(new, old);
end;
$$;

create trigger call_bookings_sync_slots
  after insert or delete on public.call_bookings
  for each row
  execute function public.sync_call_slot_bookings();

create or replace function public.prevent_overbooked_call()
returns trigger
language plpgsql
as $$
declare
  slot public.call_slots%rowtype;
begin
  select * into slot from public.call_slots where month = new.month;
  if not found then
    raise exception 'call month % has no capacity row', new.month;
  end if;
  if slot.bookings >= slot.capacity then
    raise exception 'call month % is full', new.month;
  end if;
  return new;
end;
$$;

create trigger call_bookings_prevent_overbook
  before insert on public.call_bookings
  for each row
  execute function public.prevent_overbooked_call();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, lower(coalesce(new.email, '')))
  on conflict (id) do update
    set email = excluded.email;

  perform public.link_purchases_for_email(new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

create trigger on_auth_user_email_updated
  after update of email on auth.users
  for each row
  execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Grants: revoke defaults, then re-grant only what the API needs.
-- service_role bypasses RLS and is used by the Stripe webhook.
-- ---------------------------------------------------------------------------

revoke all on table public.profiles from public, anon, authenticated;
revoke all on table public.purchases from public, anon, authenticated;
revoke all on table public.entitlements from public, anon, authenticated;
revoke all on table public.processed_events from public, anon, authenticated;
revoke all on table public.call_slots from public, anon, authenticated;
revoke all on table public.call_bookings from public, anon, authenticated;
revoke all on table public.districts from public, anon, authenticated;
revoke all on table public.schools from public, anon, authenticated;
revoke all on table public.programs from public, anon, authenticated;
revoke all on table public.modules from public, anon, authenticated;
revoke all on table public.facts from public, anon, authenticated;
revoke all on table public.corrections from public, anon, authenticated;
revoke all on table public.stale_facts from public, anon, authenticated;

grant usage on schema public to anon, authenticated, service_role;

grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant execute on all functions in schema public to service_role;

grant select on table public.profiles to authenticated;
grant select on table public.purchases to authenticated;
grant select on table public.entitlements to authenticated;
grant select on table public.call_slots to anon, authenticated;
grant select on table public.call_bookings to authenticated;
grant select on table public.districts to authenticated;
grant select on table public.schools to authenticated;
grant select on table public.programs to authenticated;
grant select on table public.modules to authenticated;
grant select on table public.facts to authenticated;
grant select on table public.stale_facts to authenticated;
grant insert (page_path, fact_id, reporter_email, message) on table public.corrections to anon, authenticated;
grant select on table public.corrections to authenticated;

grant execute on function public.link_my_purchases() to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.has_paid_guide() to authenticated;
grant execute on function public.has_paid_toolkit() to authenticated;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.purchases enable row level security;
alter table public.entitlements enable row level security;
alter table public.processed_events enable row level security;
alter table public.call_slots enable row level security;
alter table public.call_bookings enable row level security;
alter table public.districts enable row level security;
alter table public.schools enable row level security;
alter table public.programs enable row level security;
alter table public.modules enable row level security;
alter table public.facts enable row level security;
alter table public.corrections enable row level security;

create policy profiles_select_own
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid());

create policy purchases_select_own
  on public.purchases
  for select
  to authenticated
  using (
    user_id = auth.uid()
    or lower(email) = (select lower(p.email) from public.profiles p where p.id = auth.uid())
  );

create policy entitlements_select_own
  on public.entitlements
  for select
  to authenticated
  using (
    user_id = auth.uid()
    or lower(email) = (select lower(p.email) from public.profiles p where p.id = auth.uid())
  );

-- processed_events: no client policies. Webhook uses service_role.

create policy call_slots_select_public
  on public.call_slots
  for select
  to anon, authenticated
  using (true);

create policy call_bookings_select_own
  on public.call_bookings
  for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy guide_content_select_entitled
  on public.districts
  for select
  to authenticated
  using (public.has_paid_guide() or public.is_admin());

create policy schools_select_entitled
  on public.schools
  for select
  to authenticated
  using (public.has_paid_guide() or public.is_admin());

create policy programs_select_entitled
  on public.programs
  for select
  to authenticated
  using (public.has_paid_guide() or public.is_admin());

create policy modules_select_entitled
  on public.modules
  for select
  to authenticated
  using (public.has_paid_guide() or public.is_admin());

create policy facts_select_entitled
  on public.facts
  for select
  to authenticated
  using (public.has_paid_guide() or public.is_admin());

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
