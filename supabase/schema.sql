-- Onslaught's Reckoning — guild registration schema
-- Run this once in the Supabase SQL editor (Dashboard -> SQL Editor -> New query).
-- Safe to re-run: every statement is idempotent.

-- ───────────────────────────────────────────────────────────────── tables ────

-- One row per Discord account that has ever signed in.
create table if not exists public.members (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null unique references auth.users (id) on delete cascade,
  discord_id       text not null unique,
  discord_username text,
  discord_avatar   text,
  status           text not null default 'pending'
                     check (status in ('pending', 'accepted', 'rejected')),
  is_officer       boolean not null default false,
  officer_note     text,
  created_at       timestamptz not null default now(),
  last_seen_at     timestamptz not null default now()
);

-- Many characters per member. `planned` marks a character the player intends
-- to roll but has not created yet, so alts can be registered before launch.
create table if not exists public.characters (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid not null references public.members (id) on delete cascade,
  name        text not null check (char_length(btrim(name)) between 2 and 24),
  surname     text check (surname is null or char_length(btrim(surname)) <= 24),
  class       text not null check (class in (
                'Druid', 'Hunter', 'Mage', 'Paladin', 'Priest',
                'Rogue', 'Shaman', 'Warlock', 'Warrior')),
  role        text not null check (role in ('Tank', 'Heal', 'Damage')),
  professions text[] not null default '{}',
  is_main     boolean not null default false,
  planned     boolean not null default false,
  created_at  timestamptz not null default now()
);

-- A member can have at most one main. Enforced by the database rather than by
-- application code, so a double-submit cannot produce two mains.
create unique index if not exists characters_one_main_per_member
  on public.characters (member_id) where is_main;

create index if not exists characters_member_idx on public.characters (member_id);

-- ──────────────────────────────────────────────────────────────── helpers ────

-- SECURITY DEFINER so that policies on `members` can call it without
-- recursively triggering those same policies.
create or replace function public.is_officer()
  returns boolean
  language sql
  security definer
  stable
  set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.members
     where user_id = auth.uid() and is_officer
  );
$$;

-- ─────────────────────────────────────────────────────────────── triggers ────

-- Members may edit their own row, but not promote themselves to officer or
-- approve their own application. Silently restoring the old values keeps the
-- ordinary "update my profile" path working without special-casing it.
create or replace function public.guard_member_update()
  returns trigger
  language plpgsql
  security definer
  set search_path = public, pg_temp
as $$
begin
  -- auth.uid() is NULL only on a trusted connection (the SQL editor or the
  -- service role). An end user always has one, and row level security already
  -- blocks anonymous updates, so gating on it keeps the first-officer
  -- bootstrap at the end of this file working. Checking unconditionally made
  -- that UPDATE silently revert, leaving the guild with no officers at all.
  if auth.uid() is not null and not public.is_officer() then
    new.is_officer   := old.is_officer;
    new.status       := old.status;
    new.officer_note := old.officer_note;
  end if;
  return new;
end;
$$;

drop trigger if exists guard_member_update on public.members;
create trigger guard_member_update
  before update on public.members
  for each row execute function public.guard_member_update();

-- A brand new member is always pending and never an officer, whatever the
-- client sent. Promote the first officer by hand (see the end of this file).
create or replace function public.guard_member_insert()
  returns trigger
  language plpgsql
  security definer
  set search_path = public, pg_temp
as $$
begin
  -- See guard_member_update: only constrain real end users.
  if auth.uid() is not null then
    new.is_officer   := false;
    new.status       := 'pending';
    new.officer_note := null;
  end if;
  return new;
end;
$$;

drop trigger if exists guard_member_insert on public.members;
create trigger guard_member_insert
  before insert on public.members
  for each row execute function public.guard_member_insert();

-- The first character a member registers becomes their main automatically.
create or replace function public.first_character_is_main()
  returns trigger
  language plpgsql
  security definer
  set search_path = public, pg_temp
as $$
begin
  if not exists (
    select 1 from public.characters where member_id = new.member_id
  ) then
    new.is_main := true;
  else
    -- Changing main goes through set_main_character(), which clears the old
    -- one first. Forcing false here keeps the unique index from rejecting an
    -- otherwise valid insert.
    new.is_main := false;
  end if;
  return new;
end;
$$;

drop trigger if exists first_character_is_main on public.characters;
create trigger first_character_is_main
  before insert on public.characters
  for each row execute function public.first_character_is_main();

-- Deleting a main promotes the oldest remaining character, so a member is
-- never left with alts and no main.
create or replace function public.promote_after_main_delete()
  returns trigger
  language plpgsql
  security definer
  set search_path = public, pg_temp
as $$
begin
  if old.is_main then
    update public.characters
       set is_main = true
     where id = (
       select id from public.characters
        where member_id = old.member_id
        order by created_at
        limit 1
     );
  end if;
  return old;
end;
$$;

drop trigger if exists promote_after_main_delete on public.characters;
create trigger promote_after_main_delete
  after delete on public.characters
  for each row execute function public.promote_after_main_delete();

-- ──────────────────────────────────────────────────────────────────── rpc ────

-- Swapping main has to clear the previous main and set the new one in a single
-- transaction, or the unique index rejects the intermediate state.
create or replace function public.set_main_character(p_character_id uuid)
  returns void
  language plpgsql
  security definer
  set search_path = public, pg_temp
as $$
declare
  v_member uuid;
begin
  select m.id into v_member
    from public.members m
    join public.characters c on c.member_id = m.id
   where c.id = p_character_id
     and m.user_id = auth.uid();

  if v_member is null then
    raise exception 'character not found or not yours';
  end if;

  update public.characters set is_main = false
   where member_id = v_member and is_main;

  update public.characters set is_main = true
   where id = p_character_id;
end;
$$;

-- Officers approve or reject. Kept as an RPC so the officer-only check lives
-- next to the write instead of relying on column grants.
create or replace function public.set_member_status(
    p_member_id uuid,
    p_status    text,
    p_note      text default null)
  returns void
  language plpgsql
  security definer
  set search_path = public, pg_temp
as $$
begin
  if not public.is_officer() then
    raise exception 'officers only';
  end if;
  if p_status not in ('pending', 'accepted', 'rejected') then
    raise exception 'invalid status: %', p_status;
  end if;

  update public.members
     set status       = p_status,
         -- An empty string clears the note; only NULL leaves it untouched.
         officer_note = case
                          when p_note is null then officer_note
                          else nullif(btrim(p_note), '')
                        end
   where id = p_member_id;
end;
$$;

-- ──────────────────────────────────────────────────────────────────── rls ────

alter table public.members    enable row level security;
alter table public.characters enable row level security;

drop policy if exists members_select on public.members;
create policy members_select on public.members
  for select using (user_id = auth.uid() or public.is_officer());

drop policy if exists members_insert on public.members;
create policy members_insert on public.members
  for insert with check (user_id = auth.uid());

drop policy if exists members_update on public.members;
create policy members_update on public.members
  for update using (user_id = auth.uid() or public.is_officer());

drop policy if exists characters_select on public.characters;
create policy characters_select on public.characters
  for select using (
    member_id in (select id from public.members where user_id = auth.uid())
    or public.is_officer()
  );

drop policy if exists characters_insert on public.characters;
create policy characters_insert on public.characters
  for insert with check (
    member_id in (select id from public.members where user_id = auth.uid())
  );

drop policy if exists characters_update on public.characters;
create policy characters_update on public.characters
  for update using (
    member_id in (select id from public.members where user_id = auth.uid())
  );

drop policy if exists characters_delete on public.characters;
create policy characters_delete on public.characters
  for delete using (
    member_id in (select id from public.members where user_id = auth.uid())
  );

-- ─────────────────────────────────────────────────────────── public roster ────

-- The roster is public, but only for accepted members, and only the columns
-- below. This view is intentionally SECURITY DEFINER (the PostgreSQL default)
-- so it can read past the row level security above; that is what makes a
-- signed-out visitor able to see the roster and nothing else.
create or replace view public.roster as
  select c.id,
         c.member_id,
         c.name,
         c.surname,
         c.class,
         c.role,
         c.professions,
         c.is_main,
         c.planned,
         m.discord_username,
         m.discord_avatar
    from public.characters c
    join public.members m on m.id = c.member_id
   where m.status = 'accepted';

grant select on public.roster to anon, authenticated;

-- ─────────────────────────────────────────────────────── first officer ────
-- Sign in through the site once, then run this with your own Discord username
-- to give yourself the officer view:
--
--   select id, discord_id, discord_username from public.members;
--
--   update public.members set is_officer = true, status = 'accepted'
--    where discord_id = '<your discord_id from that list>';
--
-- Keyed on discord_id because discord_username is nullable and not unique, so
-- it can silently match nobody, or two people at once.
--
-- The guard trigger above deliberately blocks this from the application, so
-- the SQL editor is the only way in. After that, officers accept everyone else
-- through the site.
