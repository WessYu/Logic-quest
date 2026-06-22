-- Logic Quest Creator/Admin Dashboard
-- Rode este SQL no Supabase depois do supabase/schema.sql.
-- Depois de criar sua conta no app, rode o bloco final trocando pelo seu email.

create table if not exists public.app_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

alter table public.app_users enable row level security;

create table if not exists public.app_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.app_admins enable row level security;

drop policy if exists "Admins can read own admin record" on public.app_admins;
create policy "Admins can read own admin record"
  on public.app_admins
  for select
  using (auth.uid() = user_id);

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.app_users (user_id, email, created_at)
  values (new.id, new.email, new.created_at)
  on conflict (user_id) do update
    set email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_logic_quest on auth.users;
create trigger on_auth_user_created_logic_quest
  after insert on auth.users
  for each row
  execute function public.handle_new_auth_user();

insert into public.app_users (user_id, email, created_at)
select id, email, created_at
from auth.users
on conflict (user_id) do update
  set email = excluded.email;

create or replace function public.get_admin_dashboard()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  caller uuid := auth.uid();
  total_users integer := 0;
  users_with_progress integer := 0;
  total_completed integer := 0;
  total_xp integer := 0;
  avg_completion numeric := 0;
  avg_mastery numeric := 0;
  active_today integer := 0;
  recent_activity jsonb := '[]'::jsonb;
begin
  if caller is null or not exists (select 1 from public.app_admins where user_id = caller) then
    raise exception 'not_authorized';
  end if;

  select count(*)::integer
  into total_users
  from public.app_users;

  with progress_rows as (
    select
      up.user_id,
      up.progress,
      up.updated_at,
      coalesce((
        select count(*)
        from jsonb_each(up.progress) as lesson(id, data)
        where (data->>'completed')::boolean is true
      ), 0) as completed_count,
      coalesce((
        select sum(coalesce((data->>'xpEarned')::int, 0))
        from jsonb_each(up.progress) as lesson(id, data)
      ), 0) as xp_count,
      coalesce((
        select avg(nullif(data->>'bestScore', '')::numeric)
        from jsonb_each(up.progress) as lesson(id, data)
        where data ? 'bestScore'
      ), 0) as mastery_score
    from public.user_progress up
  )
  select
    count(*) filter (where completed_count > 0)::integer,
    coalesce(sum(completed_count), 0)::integer,
    coalesce(sum(xp_count), 0)::integer,
    coalesce(round(avg(least(100, completed_count * 100.0 / 28))), 0),
    coalesce(round(avg(mastery_score)), 0),
    count(*) filter (where updated_at >= now() - interval '24 hours')::integer
  into users_with_progress, total_completed, total_xp, avg_completion, avg_mastery, active_today
  from progress_rows;

  with progress_rows as (
    select
      au.email,
      up.updated_at,
      coalesce((
        select count(*)
        from jsonb_each(up.progress) as lesson(id, data)
        where (data->>'completed')::boolean is true
      ), 0) as completed_count,
      coalesce((
        select sum(coalesce((data->>'xpEarned')::int, 0))
        from jsonb_each(up.progress) as lesson(id, data)
      ), 0) as xp_count
    from public.user_progress up
    left join public.app_users au on au.user_id = up.user_id
    order by up.updated_at desc
    limit 6
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'email', email,
    'completed', completed_count,
    'xp', xp_count,
    'updated_at', updated_at
  )), '[]'::jsonb)
  into recent_activity
  from progress_rows;

  return jsonb_build_object(
    'total_users', total_users,
    'users_with_progress', users_with_progress,
    'avg_completion', avg_completion,
    'avg_mastery', avg_mastery,
    'total_completed', total_completed,
    'total_xp', total_xp,
    'active_today', active_today,
    'recent_activity', recent_activity,
    'generated_at', now()
  );
end;
$$;

revoke all on function public.get_admin_dashboard() from public;
grant execute on function public.get_admin_dashboard() to authenticated;

-- Rode este comando uma vez, trocando pelo email da sua conta no Logic Quest:
-- insert into public.app_admins (user_id)
-- select id from auth.users where email = 'SEU_EMAIL_AQUI'
-- on conflict do nothing;
