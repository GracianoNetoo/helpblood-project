create extension if not exists pgcrypto;

do $$
begin
  create type public.user_role as enum ('donor', 'admin');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.profile_status as enum ('ativo', 'suspenso');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.campaign_status as enum ('ativo', 'inativo');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.campaign_highlight as enum ('aberto', 'critico');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.appointment_status as enum ('confirmado', 'cancelado', 'concluido', 'imediato');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.appointment_source as enum ('campaign', 'emergency');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.help_request_status as enum ('pending', 'approved', 'rejected');
exception
  when duplicate_object then null;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'donor',
  nome text not null,
  tipo_sanguineo text,
  rh text,
  provincia text,
  municipio text,
  telefone text,
  email text,
  doacao_sangue text,
  status public.profile_status not null default 'ativo',
  total_donation_liters numeric(10, 2) not null default 0 check (total_donation_liters >= 0),
  last_donation_liters numeric(4, 2) check (last_donation_liters is null or (last_donation_liters >= 0 and last_donation_liters <= 1.0)),
  last_donation_date date,
  last_donation_campaign_id uuid,
  last_donation_campaign_title text,
  last_donation_campaign_location text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  location text not null,
  date_iso date not null,
  time_slot time,
  description text,
  tags text[] not null default '{}',
  highlight public.campaign_highlight not null default 'aberto',
  status public.campaign_status not null default 'ativo',
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles
  add constraint profiles_last_donation_campaign_id_fkey
  foreign key (last_donation_campaign_id)
  references public.campaigns (id)
  on delete set null;

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid not null references auth.users (id) on delete cascade,
  campaign_id uuid references public.campaigns (id) on delete set null,
  hospital_name text not null,
  scheduled_date date not null,
  scheduled_time time,
  status public.appointment_status not null default 'confirmado',
  source public.appointment_source not null default 'campaign',
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.help_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid references auth.users (id) on delete set null,
  requester_name text,
  anonimo boolean not null default false,
  tipo_sanguineo text not null,
  localizacao text not null,
  volume text,
  urgencia text not null,
  motivo text not null,
  contacto text not null,
  status public.help_request_status not null default 'pending',
  approved_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint help_requests_anonymous_name_check
    check (
      (anonimo = true and (requester_name is null or requester_name = ''))
      or anonimo = false
    )
);

create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid not null references auth.users (id) on delete cascade,
  campaign_id uuid references public.campaigns (id) on delete set null,
  appointment_id uuid references public.appointments (id) on delete set null,
  liters numeric(4, 2) not null check (liters >= 0.1 and liters <= 1.0),
  donated_at date not null default current_date,
  campaign_title_snapshot text,
  campaign_location_snapshot text,
  recorded_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_profiles_role on public.profiles (role);
create index if not exists idx_profiles_status on public.profiles (status);
create index if not exists idx_profiles_blood_type on public.profiles (tipo_sanguineo);
create index if not exists idx_campaigns_status_date on public.campaigns (status, date_iso);
create index if not exists idx_appointments_donor_status on public.appointments (donor_id, status);
create index if not exists idx_appointments_campaign on public.appointments (campaign_id);
create index if not exists idx_help_requests_status_created_at on public.help_requests (status, created_at desc);
create index if not exists idx_help_requests_requester on public.help_requests (requester_id);
create index if not exists idx_donations_donor_date on public.donations (donor_id, donated_at desc);
create index if not exists idx_donations_campaign on public.donations (campaign_id);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    role,
    nome,
    tipo_sanguineo,
    rh,
    provincia,
    municipio,
    telefone,
    email,
    doacao_sangue,
    status
  )
  values (
    new.id,
    'donor',
    coalesce(new.raw_user_meta_data->>'nome', split_part(coalesce(new.email, ''), '@', 1), 'Doador'),
    new.raw_user_meta_data->>'tipo_sanguineo',
    new.raw_user_meta_data->>'rh',
    new.raw_user_meta_data->>'provincia',
    new.raw_user_meta_data->>'municipio',
    new.raw_user_meta_data->>'telefone',
    coalesce(new.email, new.raw_user_meta_data->>'email'),
    new.raw_user_meta_data->>'doacao_sangue',
    'ativo'
  )
  on conflict (id) do update
  set
    nome = excluded.nome,
    tipo_sanguineo = excluded.tipo_sanguineo,
    rh = excluded.rh,
    provincia = excluded.provincia,
    municipio = excluded.municipio,
    telefone = excluded.telefone,
    email = excluded.email,
    doacao_sangue = excluded.doacao_sangue,
    updated_at = timezone('utc', now());

  return new;
end;
$$;

create or replace function public.sync_profile_donation_summary(target_user uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  latest_record record;
  total_liters numeric(10, 2);
begin
  select coalesce(sum(liters), 0)
  into total_liters
  from public.donations
  where donor_id = target_user;

  select
    d.liters,
    d.donated_at,
    d.campaign_id,
    coalesce(d.campaign_title_snapshot, c.title) as campaign_title,
    coalesce(d.campaign_location_snapshot, c.location) as campaign_location
  into latest_record
  from public.donations d
  left join public.campaigns c on c.id = d.campaign_id
  where d.donor_id = target_user
  order by d.donated_at desc, d.created_at desc
  limit 1;

  update public.profiles
  set
    total_donation_liters = coalesce(total_liters, 0),
    last_donation_liters = latest_record.liters,
    last_donation_date = latest_record.donated_at,
    last_donation_campaign_id = latest_record.campaign_id,
    last_donation_campaign_title = latest_record.campaign_title,
    last_donation_campaign_location = latest_record.campaign_location,
    updated_at = timezone('utc', now())
  where id = target_user;

  if not found then
    return;
  end if;

  if latest_record is null then
    update public.profiles
    set
      total_donation_liters = 0,
      last_donation_liters = null,
      last_donation_date = null,
      last_donation_campaign_id = null,
      last_donation_campaign_title = null,
      last_donation_campaign_location = null,
      updated_at = timezone('utc', now())
    where id = target_user;
  end if;
end;
$$;

create or replace function public.handle_donation_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  affected_user uuid;
begin
  affected_user := coalesce(new.donor_id, old.donor_id);
  if affected_user is not null then
    perform public.sync_profile_donation_summary(affected_user);
  end if;
  return coalesce(new, old);
end;
$$;

create or replace function public.mark_related_appointments_completed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.appointment_id is not null then
    update public.appointments
    set
      status = 'concluido',
      updated_at = timezone('utc', now())
    where id = new.appointment_id;
  elsif new.campaign_id is not null then
    update public.appointments
    set
      status = 'concluido',
      updated_at = timezone('utc', now())
    where donor_id = new.donor_id
      and campaign_id = new.campaign_id
      and status in ('confirmado', 'imediato');
  end if;

  return new;
end;
$$;

create or replace function public.secure_help_request_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.status = 'pending';
  new.approved_by = null;

  if auth.uid() is null then
    new.requester_id = null;
  else
    new.requester_id = auth.uid();
  end if;

  return new;
end;
$$;

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  target_user uuid := auth.uid();
begin
  if target_user is null then
    raise exception 'Utilizador nao autenticado.';
  end if;

  delete from auth.users
  where id = target_user;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists trg_auth_users_create_profile on auth.users;
create trigger trg_auth_users_create_profile
after insert on auth.users
for each row
execute function public.handle_new_user();

drop trigger if exists trg_campaigns_updated_at on public.campaigns;
create trigger trg_campaigns_updated_at
before update on public.campaigns
for each row
execute function public.set_updated_at();

drop trigger if exists trg_appointments_updated_at on public.appointments;
create trigger trg_appointments_updated_at
before update on public.appointments
for each row
execute function public.set_updated_at();

drop trigger if exists trg_help_requests_updated_at on public.help_requests;
create trigger trg_help_requests_updated_at
before update on public.help_requests
for each row
execute function public.set_updated_at();

drop trigger if exists trg_help_requests_secure_insert on public.help_requests;
create trigger trg_help_requests_secure_insert
before insert on public.help_requests
for each row
execute function public.secure_help_request_insert();

drop trigger if exists trg_donations_after_change on public.donations;
create trigger trg_donations_after_change
after insert or update or delete on public.donations
for each row
execute function public.handle_donation_change();

drop trigger if exists trg_donations_complete_appointments on public.donations;
create trigger trg_donations_complete_appointments
after insert on public.donations
for each row
execute function public.mark_related_appointments_completed();

alter table public.profiles enable row level security;
alter table public.campaigns enable row level security;
alter table public.appointments enable row level security;
alter table public.help_requests enable row level security;
alter table public.donations enable row level security;

drop policy if exists "profiles_select_self_or_admin" on public.profiles;
create policy "profiles_select_self_or_admin"
on public.profiles
for select
to authenticated
using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "profiles_update_self_or_admin" on public.profiles;
create policy "profiles_update_self_or_admin"
on public.profiles
for update
to authenticated
using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_delete_admin_only" on public.profiles;
create policy "profiles_delete_admin_only"
on public.profiles
for delete
to authenticated
using (public.is_admin());

drop policy if exists "campaigns_public_active_select" on public.campaigns;
create policy "campaigns_public_active_select"
on public.campaigns
for select
to anon, authenticated
using (status = 'ativo' or public.is_admin());

drop policy if exists "campaigns_admin_insert" on public.campaigns;
create policy "campaigns_admin_insert"
on public.campaigns
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "campaigns_admin_update" on public.campaigns;
create policy "campaigns_admin_update"
on public.campaigns
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "campaigns_admin_delete" on public.campaigns;
create policy "campaigns_admin_delete"
on public.campaigns
for delete
to authenticated
using (public.is_admin());

drop policy if exists "appointments_select_owner_or_admin" on public.appointments;
create policy "appointments_select_owner_or_admin"
on public.appointments
for select
to authenticated
using (auth.uid() = donor_id or public.is_admin());

drop policy if exists "appointments_insert_owner_or_admin" on public.appointments;
create policy "appointments_insert_owner_or_admin"
on public.appointments
for insert
to authenticated
with check (auth.uid() = donor_id or public.is_admin());

drop policy if exists "appointments_update_owner_or_admin" on public.appointments;
create policy "appointments_update_owner_or_admin"
on public.appointments
for update
to authenticated
using (auth.uid() = donor_id or public.is_admin())
with check (auth.uid() = donor_id or public.is_admin());

drop policy if exists "appointments_delete_owner_or_admin" on public.appointments;
create policy "appointments_delete_owner_or_admin"
on public.appointments
for delete
to authenticated
using (auth.uid() = donor_id or public.is_admin());

drop policy if exists "help_requests_public_select_approved" on public.help_requests;
create policy "help_requests_public_select_approved"
on public.help_requests
for select
to anon, authenticated
using (status = 'approved');

drop policy if exists "help_requests_select_owner_or_admin" on public.help_requests;
create policy "help_requests_select_owner_or_admin"
on public.help_requests
for select
to authenticated
using (requester_id = auth.uid() or public.is_admin());

drop policy if exists "help_requests_public_insert" on public.help_requests;
create policy "help_requests_public_insert"
on public.help_requests
for insert
to anon, authenticated
with check (
  status = 'pending'
  and approved_by is null
  and (
    (auth.uid() is null and requester_id is null)
    or (auth.uid() is not null and requester_id = auth.uid())
  )
);

drop policy if exists "help_requests_admin_update" on public.help_requests;
create policy "help_requests_admin_update"
on public.help_requests
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "help_requests_admin_delete" on public.help_requests;
create policy "help_requests_admin_delete"
on public.help_requests
for delete
to authenticated
using (public.is_admin());

drop policy if exists "donations_select_owner_or_admin" on public.donations;
create policy "donations_select_owner_or_admin"
on public.donations
for select
to authenticated
using (auth.uid() = donor_id or public.is_admin());

drop policy if exists "donations_admin_insert" on public.donations;
create policy "donations_admin_insert"
on public.donations
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "donations_admin_update" on public.donations;
create policy "donations_admin_update"
on public.donations
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "donations_admin_delete" on public.donations;
create policy "donations_admin_delete"
on public.donations
for delete
to authenticated
using (public.is_admin());

revoke all on function public.delete_my_account() from public;
grant execute on function public.delete_my_account() to authenticated;
