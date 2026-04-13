do $$
begin
  create type public.reward_type as enum ('cupom', 'consulta_gratuita', 'agradecimento');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.reward_rarity as enum ('comum', 'raro', 'epico');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.reward_attempt_status as enum ('ganhou', 'falhou');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.reward_settings (
  id integer primary key default 1,
  miss_weight integer not null default 45 check (miss_weight >= 0),
  pity_threshold integer not null default 5 check (pity_threshold >= 1),
  rate_limit_seconds integer not null default 8 check (rate_limit_seconds >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint reward_settings_single_row check (id = 1)
);

insert into public.reward_settings (id)
values (1)
on conflict (id) do nothing;

create table if not exists public.rewards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  reward_type public.reward_type not null,
  rarity public.reward_rarity not null default 'comum',
  quantity_available integer not null default 0 check (quantity_available >= 0),
  weight integer not null default 1 check (weight > 0),
  guaranteed_after_failures integer check (guaranteed_after_failures is null or guaranteed_after_failures >= 1),
  expires_at timestamptz,
  is_active boolean not null default true,
  meta jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.reward_credits (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid not null references auth.users (id) on delete cascade,
  donation_id uuid not null unique references public.donations (id) on delete cascade,
  consumed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.reward_attempts (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid not null references auth.users (id) on delete cascade,
  reward_credit_id uuid not null unique references public.reward_credits (id) on delete restrict,
  reward_id uuid references public.rewards (id) on delete set null,
  status public.reward_attempt_status not null,
  reward_title_snapshot text,
  reward_type_snapshot public.reward_type,
  reward_rarity_snapshot public.reward_rarity,
  attempted_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_rewards_active_stock on public.rewards (is_active, quantity_available);
create index if not exists idx_reward_credits_donor_available on public.reward_credits (donor_id, consumed_at, created_at desc);
create index if not exists idx_reward_attempts_donor_date on public.reward_attempts (donor_id, attempted_at desc);
create index if not exists idx_reward_attempts_reward on public.reward_attempts (reward_id);

create or replace function public.create_reward_credit_for_donation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.reward_credits (
    donor_id,
    donation_id
  )
  values (
    new.donor_id,
    new.id
  )
  on conflict (donation_id) do nothing;

  return new;
end;
$$;

create or replace function public.get_my_reward_status()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  target_user uuid := auth.uid();
  available_attempts integer := 0;
  total_donations integer := 0;
  total_attempts integer := 0;
  total_wins integer := 0;
  total_failures integer := 0;
  failed_streak integer := 0;
  last_reward_title text := null;
  last_attempt_at timestamptz := null;
begin
  if target_user is null then
    raise exception 'Utilizador nao autenticado.';
  end if;

  select count(*)
  into available_attempts
  from public.reward_credits
  where donor_id = target_user
    and consumed_at is null;

  select count(*)
  into total_donations
  from public.donations
  where donor_id = target_user;

  select count(*)
  into total_attempts
  from public.reward_attempts
  where donor_id = target_user;

  select count(*)
  into total_wins
  from public.reward_attempts
  where donor_id = target_user
    and status = 'ganhou';

  select count(*)
  into total_failures
  from public.reward_attempts
  where donor_id = target_user
    and status = 'falhou';

  select reward_title_snapshot, attempted_at
  into last_reward_title, last_attempt_at
  from public.reward_attempts
  where donor_id = target_user
  order by attempted_at desc, created_at desc
  limit 1;

  select count(*)
  into failed_streak
  from public.reward_attempts
  where donor_id = target_user
    and status = 'falhou'
    and attempted_at > coalesce(
      (
        select max(attempted_at)
        from public.reward_attempts
        where donor_id = target_user
          and status = 'ganhou'
      ),
      '-infinity'::timestamptz
    );

  return jsonb_build_object(
    'available_attempts', available_attempts,
    'total_donations', total_donations,
    'total_attempts', total_attempts,
    'total_wins', total_wins,
    'total_failures', total_failures,
    'failed_streak', failed_streak,
    'last_reward_title', last_reward_title,
    'last_attempt_at', last_attempt_at
  );
end;
$$;

create or replace function public.claim_reward_attempt()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  target_user uuid := auth.uid();
  reward_credit_record public.reward_credits%rowtype;
  reward_record public.rewards%rowtype;
  candidate_record record;
  selected_reward public.rewards%rowtype;
  settings_record public.reward_settings%rowtype;
  donations_count integer := 0;
  failed_streak integer := 0;
  total_weight integer := 0;
  cumulative_weight integer := 0;
  roll integer := 0;
  guarantee_triggered boolean := false;
  rate_limit_until timestamptz := null;
  attempt_id uuid := gen_random_uuid();
begin
  if target_user is null then
    raise exception 'Utilizador nao autenticado.';
  end if;

  perform pg_advisory_xact_lock(hashtext(target_user::text));

  select *
  into settings_record
  from public.reward_settings
  where id = 1;

  if settings_record.id is null then
    insert into public.reward_settings (id)
    values (1)
    on conflict (id) do nothing;

    select *
    into settings_record
    from public.reward_settings
    where id = 1;
  end if;

  select count(*)
  into donations_count
  from public.donations
  where donor_id = target_user;

  if donations_count < 1 then
    raise exception 'Ainda nao elegivel para recompensas.';
  end if;

  select attempted_at + make_interval(secs => settings_record.rate_limit_seconds)
  into rate_limit_until
  from public.reward_attempts
  where donor_id = target_user
  order by attempted_at desc, created_at desc
  limit 1;

  if rate_limit_until is not null and rate_limit_until > timezone('utc', now()) then
    raise exception 'Aguarde alguns segundos antes de tentar novamente.';
  end if;

  select *
  into reward_credit_record
  from public.reward_credits
  where donor_id = target_user
    and consumed_at is null
  order by created_at asc
  limit 1
  for update skip locked;

  if reward_credit_record.id is null then
    raise exception 'Sem tentativas disponiveis.';
  end if;

  select count(*)
  into failed_streak
  from public.reward_attempts
  where donor_id = target_user
    and status = 'falhou'
    and attempted_at > coalesce(
      (
        select max(attempted_at)
        from public.reward_attempts
        where donor_id = target_user
          and status = 'ganhou'
      ),
      '-infinity'::timestamptz
    );

  guarantee_triggered := failed_streak + 1 >= settings_record.pity_threshold;

  if guarantee_triggered then
    for candidate_record in
      select *
      from public.rewards
      where is_active = true
        and quantity_available > 0
        and (expires_at is null or expires_at > timezone('utc', now()))
        and (
          guaranteed_after_failures is null
          or guaranteed_after_failures <= failed_streak + 1
        )
      order by coalesce(guaranteed_after_failures, settings_record.pity_threshold) asc, weight desc, created_at asc
      for update
    loop
      total_weight := total_weight + candidate_record.weight;
    end loop;

    if total_weight > 0 then
      roll := floor(random() * total_weight)::integer + 1;
      cumulative_weight := 0;

      for candidate_record in
        select *
        from public.rewards
        where is_active = true
          and quantity_available > 0
          and (expires_at is null or expires_at > timezone('utc', now()))
          and (
            guaranteed_after_failures is null
            or guaranteed_after_failures <= failed_streak + 1
          )
        order by coalesce(guaranteed_after_failures, settings_record.pity_threshold) asc, weight desc, created_at asc
        for update
      loop
        cumulative_weight := cumulative_weight + candidate_record.weight;
        if roll <= cumulative_weight then
          selected_reward := candidate_record;
          exit;
        end if;
      end loop;
    else
      raise exception 'Nenhuma recompensa ativa disponivel.';
    end if;
  else
    for candidate_record in
      select *
      from public.rewards
      where is_active = true
        and quantity_available > 0
        and (expires_at is null or expires_at > timezone('utc', now()))
      order by weight desc, created_at asc
      for update
    loop
      total_weight := total_weight + candidate_record.weight;
    end loop;

    if total_weight <= 0 then
      raise exception 'Nenhuma recompensa ativa disponivel.';
    end if;

    roll := floor(random() * (total_weight + settings_record.miss_weight))::integer + 1;

    if roll <= total_weight then
      cumulative_weight := 0;
      for candidate_record in
        select *
        from public.rewards
        where is_active = true
          and quantity_available > 0
          and (expires_at is null or expires_at > timezone('utc', now()))
        order by weight desc, created_at asc
        for update
      loop
        cumulative_weight := cumulative_weight + candidate_record.weight;
        if roll <= cumulative_weight then
          selected_reward := candidate_record;
          exit;
        end if;
      end loop;
    end if;
  end if;

  update public.reward_credits
  set consumed_at = timezone('utc', now())
  where id = reward_credit_record.id;

  if selected_reward.id is not null then
    update public.rewards
    set
      quantity_available = quantity_available - 1,
      updated_at = timezone('utc', now())
    where id = selected_reward.id
      and quantity_available > 0
    returning *
    into reward_record;

    if reward_record.id is null then
      raise exception 'A recompensa selecionada ficou indisponivel durante o sorteio.';
    end if;

    insert into public.reward_attempts (
      id,
      donor_id,
      reward_credit_id,
      reward_id,
      status,
      reward_title_snapshot,
      reward_type_snapshot,
      reward_rarity_snapshot,
      attempted_at
    )
    values (
      attempt_id,
      target_user,
      reward_credit_record.id,
      reward_record.id,
      'ganhou',
      reward_record.title,
      reward_record.reward_type,
      reward_record.rarity,
      timezone('utc', now())
    );

    return jsonb_build_object(
      'attempt_id', attempt_id,
      'status', 'ganhou',
      'reward', jsonb_build_object(
        'id', reward_record.id,
        'title', reward_record.title,
        'type', reward_record.reward_type,
        'rarity', reward_record.rarity
      ),
      'remaining_attempts', (
        select count(*)
        from public.reward_credits
        where donor_id = target_user
          and consumed_at is null
      )
    );
  end if;

  insert into public.reward_attempts (
    id,
    donor_id,
    reward_credit_id,
    reward_id,
    status,
    reward_title_snapshot,
    attempted_at
  )
  values (
    attempt_id,
    target_user,
    reward_credit_record.id,
    null,
    'falhou',
    null,
    timezone('utc', now())
  );

  return jsonb_build_object(
    'attempt_id', attempt_id,
    'status', 'falhou',
    'reward', null,
    'remaining_attempts', (
      select count(*)
      from public.reward_credits
      where donor_id = target_user
        and consumed_at is null
    )
  );
end;
$$;

drop trigger if exists trg_reward_settings_updated_at on public.reward_settings;
create trigger trg_reward_settings_updated_at
before update on public.reward_settings
for each row
execute function public.set_updated_at();

drop trigger if exists trg_rewards_updated_at on public.rewards;
create trigger trg_rewards_updated_at
before update on public.rewards
for each row
execute function public.set_updated_at();

drop trigger if exists trg_donations_create_reward_credit on public.donations;
create trigger trg_donations_create_reward_credit
after insert on public.donations
for each row
execute function public.create_reward_credit_for_donation();

alter table public.reward_settings enable row level security;
alter table public.rewards enable row level security;
alter table public.reward_credits enable row level security;
alter table public.reward_attempts enable row level security;

drop policy if exists "reward_settings_select_authenticated" on public.reward_settings;
create policy "reward_settings_select_authenticated"
on public.reward_settings
for select
to authenticated
using (true);

drop policy if exists "reward_settings_admin_update" on public.reward_settings;
create policy "reward_settings_admin_update"
on public.reward_settings
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "rewards_public_select_active" on public.rewards;
create policy "rewards_public_select_active"
on public.rewards
for select
to authenticated
using (is_active = true or public.is_admin());

drop policy if exists "rewards_admin_insert" on public.rewards;
create policy "rewards_admin_insert"
on public.rewards
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "rewards_admin_update" on public.rewards;
create policy "rewards_admin_update"
on public.rewards
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "reward_credits_select_owner_or_admin" on public.reward_credits;
create policy "reward_credits_select_owner_or_admin"
on public.reward_credits
for select
to authenticated
using (donor_id = auth.uid() or public.is_admin());

drop policy if exists "reward_attempts_select_owner_or_admin" on public.reward_attempts;
create policy "reward_attempts_select_owner_or_admin"
on public.reward_attempts
for select
to authenticated
using (donor_id = auth.uid() or public.is_admin());

revoke all on function public.get_my_reward_status() from public;
grant execute on function public.get_my_reward_status() to authenticated;

revoke all on function public.claim_reward_attempt() from public;
grant execute on function public.claim_reward_attempt() to authenticated;
