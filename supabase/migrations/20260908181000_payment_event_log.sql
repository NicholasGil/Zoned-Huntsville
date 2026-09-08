-- Durable audit log for Stripe webhook fulfillment attempts.
-- Complements processed_events dedupe with one row per attempt/result.

create table public.payment_event_log (
  id uuid primary key default gen_random_uuid(),
  event_id text not null,
  event_type text not null,
  result text not null,
  reason text,
  recorded_at timestamptz not null default now()
);

create index payment_event_log_event_id_idx on public.payment_event_log (event_id);
create index payment_event_log_recorded_at_idx on public.payment_event_log (recorded_at);

revoke all on table public.payment_event_log from public, anon, authenticated;
alter table public.payment_event_log enable row level security;

grant all on table public.payment_event_log to service_role;
