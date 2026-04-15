-- Optimized claim_reward_attempt function
-- Removes duplicate FOR loops by using a CTE-based approach with a single pass
-- over the rewards table for weighted random selection.

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
  selected_reward public.rewards%rowtype;
  settings_record public.reward_settings%rowtype;
  donations_count integer := 0;
  failed_streak integer := 0;
  total_weight integer := 0;
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
    raise exception 'Ainda não elegivel para recompensas.';
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

  -- Single-pass weighted selection using CTE
  if guarantee_triggered then
    with eligible as (
      select *,
        sum(weight) over (order by coalesce(guaranteed_after_failures, settings_record.pity_threshold) asc, weight desc, created_at asc) as cumulative_weight,
        sum(weight) over () as total_w
      from public.rewards
      where is_active = true
        and quantity_available > 0
        and (expires_at is null or expires_at > timezone('utc', now()))
        and (
          guaranteed_after_failures is null
          or guaranteed_after_failures <= failed_streak + 1
        )
      for update
    )
    select e.total_w into total_weight from eligible e limit 1;

    if total_weight is null or total_weight <= 0 then
      raise exception 'Nenhuma recompensa ativa disponivel.';
    end if;

    roll := floor(random() * total_weight)::integer + 1;

    with eligible as (
      select *,
        sum(weight) over (order by coalesce(guaranteed_after_failures, settings_record.pity_threshold) asc, weight desc, created_at asc) as cumulative_weight
      from public.rewards
      where is_active = true
        and quantity_available > 0
        and (expires_at is null or expires_at > timezone('utc', now()))
        and (
          guaranteed_after_failures is null
          or guaranteed_after_failures <= failed_streak + 1
        )
      for update
    )
    select * into selected_reward
    from eligible
    where cumulative_weight >= roll
    order by cumulative_weight asc
    limit 1;
  else
    with eligible as (
      select *,
        sum(weight) over (order by weight desc, created_at asc) as cumulative_weight,
        sum(weight) over () as total_w
      from public.rewards
      where is_active = true
        and quantity_available > 0
        and (expires_at is null or expires_at > timezone('utc', now()))
      for update
    )
    select e.total_w into total_weight from eligible e limit 1;

    if total_weight is null or total_weight <= 0 then
      raise exception 'Nenhuma recompensa ativa disponivel.';
    end if;

    roll := floor(random() * (total_weight + settings_record.miss_weight))::integer + 1;

    if roll <= total_weight then
      with eligible as (
        select *,
          sum(weight) over (order by weight desc, created_at asc) as cumulative_weight
        from public.rewards
        where is_active = true
          and quantity_available > 0
          and (expires_at is null or expires_at > timezone('utc', now()))
        for update
      )
      select * into selected_reward
      from eligible
      where cumulative_weight >= roll
      order by cumulative_weight asc
      limit 1;
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
      raise exception 'A recompensa selecionada ficou indisponível durante o sorteio.';
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
