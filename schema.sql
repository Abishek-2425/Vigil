-- Supabase Database Schema for Vigil Uptime Monitor
-- Run this in the Supabase SQL Editor to set up your tables, indexes, and RLS policies.

-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

---------------------------------------------------------
-- 1. MONITORS TABLE
---------------------------------------------------------
create table public.monitors (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text,
  url text not null,
  is_active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.monitors enable row level security;

-- Policies for Monitors
create policy "Users can view their own monitors"
  on public.monitors for select
  using (auth.uid() = user_id);

create policy "Users can insert their own monitors"
  on public.monitors for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own monitors"
  on public.monitors for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own monitors"
  on public.monitors for delete
  using (auth.uid() = user_id);

---------------------------------------------------------
-- 2. CHECKS TABLE
---------------------------------------------------------
create table public.checks (
  id uuid default gen_random_uuid() primary key,
  monitor_id uuid not null references public.monitors(id) on delete cascade,
  is_up boolean not null,
  status integer,
  response_time_ms integer not null,
  checked_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.checks enable row level security;

-- Policies for Checks
create policy "Users can view checks of their own monitors"
  on public.checks for select
  using (
    exists (
      select 1 from public.monitors
      where public.monitors.id = public.checks.monitor_id
      and public.monitors.user_id = auth.uid()
    )
  );

create policy "Allow service role insertion"
  on public.checks for insert
  with check (true); -- Service role bypasses RLS naturally, but keeping check(true) for insertion safety.

---------------------------------------------------------
-- 3. INCIDENTS TABLE
---------------------------------------------------------
create table public.incidents (
  id uuid default gen_random_uuid() primary key,
  monitor_id uuid not null references public.monitors(id) on delete cascade,
  is_resolved boolean default false not null,
  resolved_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.incidents enable row level security;

-- Policies for Incidents
create policy "Users can view incidents of their own monitors"
  on public.incidents for select
  using (
    exists (
      select 1 from public.monitors
      where public.monitors.id = public.incidents.monitor_id
      and public.monitors.user_id = auth.uid()
    )
  );

create policy "Allow service role operations"
  on public.incidents for all
  using (true)
  with check (true);

---------------------------------------------------------
-- 4. PERFORMANCE INDEXES
---------------------------------------------------------
create index idx_monitors_user_id on public.monitors(user_id);
create index idx_checks_monitor_checked_at on public.checks(monitor_id, checked_at desc);
create index idx_incidents_monitor_resolved on public.incidents(monitor_id, is_resolved);
