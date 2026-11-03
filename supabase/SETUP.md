# Discord sign-in and registration — setup

Written for whoever configures the backend. The site code is finished; these
steps connect it to a Supabase project. Until they are done, `/join` shows a
"registration is being set up" message and the rest of the site is unaffected.

The old No Meta project (`rcdzaofyariphedigfxi`) no longer resolves in DNS, so
it is either paused or deleted. None of the WoW assets depended on it — the
class icons are plain files in `public/wow/class/` — so a fresh project costs
nothing but these steps.

## 1. Create the Supabase project

<https://supabase.com/dashboard> → **New project**. Pick an EU region, since the
guild is EU. Note the project name; everything else is default.

## 2. Create a Discord OAuth application

<https://discord.com/developers/applications> → **New Application**, then
**OAuth2** in the sidebar.

Copy the **Client ID** and **Client Secret**. Under **Redirects**, add the
callback that Supabase gives you in step 3, which looks like:

```
https://<your-project-ref>.supabase.co/auth/v1/callback
```

Discord redirects to Supabase, and Supabase redirects back to this site, so this
is the only URL Discord needs.

## 3. Enable Discord in Supabase

Supabase dashboard → **Authentication** → **Sign In / Providers** → **Discord**.

Turn it on and paste the Client ID and Client Secret from step 2. The page
displays the callback URL to put into Discord.

## 4. Set the redirect URLs

Supabase dashboard → **Authentication** → **URL Configuration**.

- **Site URL**: `https://onslaughtsreckoning.com`
- **Redirect URLs**: add both of these

```
https://onslaughtsreckoning.com/auth/callback
http://localhost:3000/auth/callback
```

Sign-in fails with a redirect error if these do not match exactly.

## 5. Create the tables

Supabase dashboard → **SQL Editor** → **New query**. Paste the whole of
[`schema.sql`](./schema.sql) and run it. It is safe to re-run.

## 6. Give the site its keys

Supabase dashboard → **Project Settings** → **API Keys**. You need the project
URL and the **anon / public** key. The anon key is designed to be public and is
safe in the browser; row level security is what protects the data. Never put the
`service_role` key in this project.

Locally, create `.env.local` in the repository root (it is gitignored):

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
```

On Hostinger, set the same two variables in the Node.js app's environment. They
are inlined at build time, so **a new build is required** after setting them —
pushing a commit triggers one.

## 7. Make yourself an officer

Sign in through the site once so your row exists, then run this in the SQL
editor with your own Discord username:

```sql
update public.members
   set is_officer = true, status = 'accepted'
 where discord_username = 'your_discord_name';
```

The schema deliberately blocks this from the application, so the SQL editor is
the only way to create the first officer. After that, officers accept everyone
else from `/officers`.

## 8. Bring across the existing eight members

Have them sign in and register themselves, which is the least work and keeps the
data accurate. Alternatively insert them directly, but each row needs a
`user_id` from `auth.users`, which only exists once that person has signed in.

## What is where

| Path | Purpose |
| --- | --- |
| `/join` | Sign in, register a main, add alts, change which is main |
| `/roster` | Public roster: mains, alts, and class/role tallies |
| `/officers` | Officer-only review; 404s for everyone else |

Characters marked **Planned** are ones the player intends to roll but has not
created yet, so alts can be registered before launch.
