-- First draft of this branch created extra tables. Section 8 does not.
-- No-op if those tables were never applied.

drop table if exists public.call_bookings cascade;
drop table if exists public.call_slots cascade;
drop table if exists public.modules cascade;
drop table if exists public.programs cascade;
drop table if exists public.schools cascade;
drop table if exists public.districts cascade;
drop table if exists public.purchases cascade;
drop table if exists public.profiles cascade;
