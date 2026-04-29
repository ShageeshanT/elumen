-- Elumen production schema for Supabase Postgres.
-- Run this in the Supabase SQL editor or via Supabase CLI after creating a project.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null default 'Workspace',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(owner_user_id)
);

create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  instructions text not null default '',
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.wallets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  balance_cents integer not null default 0 check (balance_cents >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(tenant_id)
);

create table if not exists public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  wallet_id uuid not null references public.wallets(id) on delete cascade,
  kind text not null,
  amount_cents integer not null,
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  description text,
  meta_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.composio_toolkit_links (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  toolkit_slug text not null,
  connection_request_id text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(tenant_id, toolkit_slug)
);

create table if not exists public.whatsapp_pairings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending',
  qr_payload text,
  linked_label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inbound_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  pairing_id uuid references public.whatsapp_pairings(id) on delete set null,
  channel text not null,
  payload_json jsonb not null,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  storage_bucket text not null,
  storage_path text not null,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz not null default now(),
  unique(storage_bucket, storage_path)
);

create index if not exists agents_tenant_idx on public.agents(tenant_id);
create index if not exists wallet_tx_wallet_idx on public.wallet_transactions(wallet_id);
create index if not exists wa_pairings_tenant_idx on public.whatsapp_pairings(tenant_id);
create index if not exists inbound_events_tenant_idx on public.inbound_events(tenant_id);
create index if not exists media_assets_tenant_idx on public.media_assets(tenant_id);

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists tenants_updated_at on public.tenants;
create trigger tenants_updated_at
before update on public.tenants
for each row execute function public.set_updated_at();

drop trigger if exists agents_updated_at on public.agents;
create trigger agents_updated_at
before update on public.agents
for each row execute function public.set_updated_at();

drop trigger if exists wallets_updated_at on public.wallets;
create trigger wallets_updated_at
before update on public.wallets
for each row execute function public.set_updated_at();

drop trigger if exists composio_links_updated_at on public.composio_toolkit_links;
create trigger composio_links_updated_at
before update on public.composio_toolkit_links
for each row execute function public.set_updated_at();

drop trigger if exists wa_pairings_updated_at on public.whatsapp_pairings;
create trigger wa_pairings_updated_at
before update on public.whatsapp_pairings
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.tenants enable row level security;
alter table public.agents enable row level security;
alter table public.wallets enable row level security;
alter table public.wallet_transactions enable row level security;
alter table public.composio_toolkit_links enable row level security;
alter table public.whatsapp_pairings enable row level security;
alter table public.inbound_events enable row level security;
alter table public.media_assets enable row level security;

create policy "profiles are own user"
on public.profiles for all
using (id = auth.uid())
with check (id = auth.uid());

create policy "tenants are owned by user"
on public.tenants for all
using (owner_user_id = auth.uid())
with check (owner_user_id = auth.uid());

create policy "tenant members can access agents"
on public.agents for all
using (
  exists (
    select 1 from public.tenants t
    where t.id = agents.tenant_id and t.owner_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.tenants t
    where t.id = agents.tenant_id and t.owner_user_id = auth.uid()
  )
);

create policy "tenant members can read wallets"
on public.wallets for select
using (
  exists (
    select 1 from public.tenants t
    where t.id = wallets.tenant_id and t.owner_user_id = auth.uid()
  )
);

create policy "tenant members can read wallet transactions"
on public.wallet_transactions for select
using (
  exists (
    select 1
    from public.wallets w
    join public.tenants t on t.id = w.tenant_id
    where w.id = wallet_transactions.wallet_id and t.owner_user_id = auth.uid()
  )
);

create policy "tenant members can access composio links"
on public.composio_toolkit_links for all
using (
  exists (
    select 1 from public.tenants t
    where t.id = composio_toolkit_links.tenant_id and t.owner_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.tenants t
    where t.id = composio_toolkit_links.tenant_id and t.owner_user_id = auth.uid()
  )
);

create policy "tenant members can access whatsapp pairings"
on public.whatsapp_pairings for all
using (
  exists (
    select 1 from public.tenants t
    where t.id = whatsapp_pairings.tenant_id and t.owner_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.tenants t
    where t.id = whatsapp_pairings.tenant_id and t.owner_user_id = auth.uid()
  )
);

create policy "tenant members can read inbound events"
on public.inbound_events for select
using (
  exists (
    select 1 from public.tenants t
    where t.id = inbound_events.tenant_id and t.owner_user_id = auth.uid()
  )
);

create policy "tenant members can access media assets"
on public.media_assets for all
using (
  exists (
    select 1 from public.tenants t
    where t.id = media_assets.tenant_id and t.owner_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.tenants t
    where t.id = media_assets.tenant_id and t.owner_user_id = auth.uid()
  )
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'agent-media',
  'agent-media',
  false,
  52428800,
  array['image/png', 'image/jpeg', 'image/webp', 'application/pdf', 'text/plain']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "tenant media read"
on storage.objects for select
using (
  bucket_id = 'agent-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "tenant media write"
on storage.objects for insert
with check (
  bucket_id = 'agent-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "tenant media update"
on storage.objects for update
using (
  bucket_id = 'agent-media'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'agent-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "tenant media delete"
on storage.objects for delete
using (
  bucket_id = 'agent-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);
