-- 1. Create a function to handle new user signup automatically
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, created_at)
  values (new.id, now());
  return new;
end;
$$ language plpgsql security definer;

-- 2. Create the trigger on auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. CRITICAL: Backfill profiles for existing users
-- This fixes the current error by ensuring all users have a profile row
insert into public.profiles (id, created_at)
select id, created_at from auth.users
where id not in (select id from public.profiles);
