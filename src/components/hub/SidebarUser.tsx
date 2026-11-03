import { getMember, getMyCharacters } from "@/lib/dal";
import { authConfigured } from "@/lib/supabase/config";
import { signInWithDiscord, signOut } from "@/app/auth/actions";
import { ClassIcon } from "@/components/wow/CharacterBadge";
import { classColor } from "@/lib/wow";
import NavLink from "./NavLink";

/** Top of the sidebar: who you are, shown as your main character. */
export default async function SidebarUser() {
  const member = authConfigured ? await getMember() : null;

  if (!member) {
    return (
      <div className="px-3 py-4">
        <p className="text-sm text-stone-400">
          Sign in to register your characters.
        </p>
        {authConfigured && (
          <form action={signInWithDiscord} className="mt-3">
            <button type="submit" className="btn btn-ember w-full !text-xs">
              Sign in with Discord
            </button>
          </form>
        )}
      </div>
    );
  }

  const characters = await getMyCharacters();
  const main = characters.find((c) => c.is_main);
  const altCount = characters.length - (main ? 1 : 0);

  return (
    <div>
      <div className="flex items-center gap-3 px-3 py-4">
        {main ? (
          <>
            <ClassIcon className={main.class} size={36} />
            <div className="min-w-0">
              <p
                className="truncate font-display text-base leading-tight"
                style={{ color: classColor(main.class) }}
              >
                {main.name}
                {main.surname ? (
                  <span className="font-sans text-sm opacity-70">
                    {" "}
                    {main.surname}
                  </span>
                ) : null}
              </p>
              <p className="truncate text-xs text-stone-500">
                {main.class} · {main.role}
              </p>
            </div>
          </>
        ) : (
          <div className="min-w-0">
            <p className="text-sm text-stone-200">No main yet</p>
            <p className="text-xs text-stone-500">Register your character</p>
          </div>
        )}
      </div>

      <p className="truncate px-3 pb-3 text-[11px] text-stone-600">
        {member.discord_username ?? "Discord account"}
      </p>

      <div className="space-y-0.5 px-2">
        <NavLink
          href="/join"
          label={
            altCount > 0 ? `My Characters (${characters.length})` : "My Characters"
          }
        />
        {member.is_officer && <NavLink href="/officers" label="Officers" />}
      </div>

      <form action={signOut} className="mt-1 px-2">
        <button
          type="submit"
          className="w-full cursor-pointer rounded-md px-3 py-2 text-left text-sm text-stone-500 transition-colors hover:bg-stone-900/60 hover:text-stone-200"
        >
          Sign Out
        </button>
      </form>
    </div>
  );
}

export function SidebarUserFallback() {
  return (
    <div aria-hidden className="px-3 py-4">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 animate-pulse rounded bg-stone-800" />
        <div className="flex-1 space-y-1.5">
          <div className="h-4 w-24 animate-pulse rounded bg-stone-800" />
          <div className="h-3 w-16 animate-pulse rounded bg-stone-900" />
        </div>
      </div>
    </div>
  );
}
