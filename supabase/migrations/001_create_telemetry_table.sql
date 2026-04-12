-- Create telemetry table for storing anonymous skill usage data
create table if not exists telemetry (
  id bigint primary key generated always as identity,
  event text not null,
  version text not null,
  os text not null,
  duration_ms integer not null,
  flow_types text[] not null default '{}',
  success boolean not null,
  created_at timestamp with time zone default now(),
  ip_hash text -- hash of IP for deduplication, not stored raw
);

-- Create index on created_at for efficient time-based queries
create index if not exists telemetry_created_at_idx on telemetry(created_at desc);

-- Create index on event for filtering
create index if not exists telemetry_event_idx on telemetry(event);

-- Enable row-level security
alter table telemetry enable row level security;

-- Create policy to allow anonymous inserts (for the API)
create policy "Allow anonymous inserts" on telemetry
  for insert
  with check (true);

-- Create policy to allow authenticated users to read (for dashboards/analytics)
create policy "Allow authenticated reads" on telemetry
  for select
  using (auth.role() = 'authenticated');
