-- Create the leads table
create table leads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  client_name text not null,
  email text not null,
  phone text,
  destination text,
  dates text,
  travelers text,
  notes text,
  status text default 'new',
  admin_notes text
);

-- Enable Row Level Security (RLS)
alter table leads enable row level security;

-- Create policies
-- 1. Allow public to insert (for the contact form)
create policy "Public can insert leads"
on leads for insert
to anon
with check (true);

-- 2. Allow anon (admin with correct setup) to select/update
-- NOTE: In a real production app, you'd want authenticated users only.
-- For this simple dashboard, we will allow the "anon" key to read/update for now 
-- so the dashboard works without setting up complex Auth providers yet.
create policy "Enable access for all users"
on leads for select
to anon
using (true);

create policy "Enable update for all users"
on leads for update
to anon
using (true);
