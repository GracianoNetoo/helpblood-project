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

drop trigger if exists trg_help_requests_secure_insert on public.help_requests;
create trigger trg_help_requests_secure_insert
before insert on public.help_requests
for each row
execute function public.secure_help_request_insert();

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
