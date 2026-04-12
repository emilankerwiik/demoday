# Telemetry Setup and Data Storage

This document explains how Demoday collects, stores, and uses telemetry data from skill usage.

## Overview

When users opt-in during skill onboarding, anonymous usage data is sent to `https://demoday.work/api/telemetry`. The data is stored in a Supabase PostgreSQL database for analysis and product improvement.

## Data Collected

The telemetry payload contains:

```json
{
  "event": "demo_generated",
  "version": "0.1.0",
  "os": "darwin",
  "duration_ms": 15420,
  "flow_types": ["get_started", "how_it_works"],
  "success": true
}
```

**What is NOT collected:**
- Source code or file contents
- File paths or directory structures
- Repository names or URLs
- Product names
- User identities or contact information
- User-generated content

## Supabase Setup

### Prerequisites
- Supabase account (free tier works fine)
- Node.js and npm

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/log in
2. Create a new project
3. Note your project URL and anon key from the API settings

### 2. Configure Environment Variables

Add to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
IP_SALT=your-random-salt-string-here
```

The `IP_SALT` should be a random string used to hash IPs (keeps them anonymous).

### 3. Create the Telemetry Table

Run the migration in Supabase's SQL editor:

1. In Supabase, go to SQL Editor
2. Create a new query
3. Copy and run the SQL from `supabase/migrations/001_create_telemetry_table.sql`

This creates:
- `telemetry` table with columns: id, event, version, os, duration_ms, flow_types, success, created_at, ip_hash
- Indexes for efficient querying by time and event type
- Row-level security policies allowing anonymous inserts and authenticated reads

## API Endpoint

**Route:** `POST /api/telemetry`
**URL:** `https://demoday.work/api/telemetry`

The endpoint at `app/api/telemetry/route.js`:
- Validates the incoming payload
- Hashes the requester's IP for deduplication (not stored raw)
- Inserts the record into Supabase
- Returns `{ success: true }` (or silently fails to never block the skill)

## Querying Telemetry Data

### Recent Activity
```sql
select event, version, os, duration_ms, success, created_at
from telemetry
order by created_at desc
limit 100;
```

### Success Rate
```sql
select 
  success,
  count(*) as count,
  round(100.0 * count(*) / sum(count(*)) over ()) as percentage
from telemetry
where event = 'demo_generated'
group by success;
```

### Average Duration by OS
```sql
select 
  os,
  count(*) as runs,
  round(avg(duration_ms)) as avg_duration_ms
from telemetry
where event = 'demo_generated' and success = true
group by os
order by avg_duration_ms desc;
```

### Popular Flow Types
```sql
select 
  flow_type,
  count(*) as count
from telemetry,
lateral unnest(flow_types) as flow_type
where event = 'demo_generated'
group by flow_type
order by count desc;
```

## Privacy & Security

- **IP Hashing:** Raw IPs are never stored. They're hashed with a salt to allow deduplication without exposing user identity.
- **Row-Level Security:** RLS policies prevent unauthorized access:
  - Anonymous users can only INSERT
  - Authenticated users (your team) can only SELECT
- **No PII:** Telemetry explicitly excludes any personally identifiable information
- **Opt-in:** Users must consent before any data is sent

## Maintenance

### Data Retention
Consider archiving or deleting old telemetry after 12 months to comply with privacy best practices:

```sql
delete from telemetry
where created_at < now() - interval '1 year';
```

### Monitoring
Set up Supabase notifications or export telemetry to a BI tool for dashboards.

## Skill Implementation

The skill reads the local config at `~/.demoday/config.json`:

```json
{
  "telemetry": true,
  "autoUpdate": null,
  "version": 1,
  "createdAt": "2026-04-12T..."
}
```

When `telemetry` is `true`, the skill POSTs to `/api/telemetry` after generation completes. If the POST fails, the skill silently continues — telemetry errors never block the user's workflow.
