import Link from "next/link";
import { cookies } from "next/headers";
import { getUser } from "@/lib/dal";
import { authConfigured } from "@/lib/supabase/config";
import { signInWithDiscord } from "@/app/auth/actions";
import { FlameExternal, FlameLink, FlameSubmit } from "@/components/FlameButton";
import DiscordLink, { DISCORD_INVITE } from "@/components/DiscordLink";

/**
 * Set on first successful sign-in. Registering and logging in are the same
 * Discord handoff, so this only decides which word the button uses: a first
 * time visitor is asked to Register, someone who has an account to Log In.
 */
export const RETURNING_COOKIE = "or_member";

export default async function HomeCta() {
  const user = await getUser();
  const returning = (await cookies()).has(RETURNING_COOKIE);

  // No backend configured: Discord is the only thing we can honestly offer.
  if (!authConfigured) {
    return (
      <div className="flex flex-col items-center">
        <FlameExternal href={DISCORD_INVITE}>Join Our Discord</FlameExternal>
        <RosterLink className="mt-7" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {user ? (
        <FlameLink href="/join">My Characters</FlameLink>
      ) : (
        <form action={signInWithDiscord}>
          <FlameSubmit>{returning ? "Log In" : "Register"}</FlameSubmit>
        </form>
      )}

      {!user && (
        <p className="mt-4 text-center text-xs text-stone-500">
          {returning
            ? "Sign in with the Discord account you registered with."
            : "Takes a moment — we use your Discord account, so there's no new password."}
        </p>
      )}

      {/* Deliberately quieter than the primary action above. */}
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <DiscordLink className="!px-4 !py-2 !text-xs" />
        <RosterLink />
      </div>
    </div>
  );
}

function RosterLink({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/roster"
      className={`text-[11px] uppercase tracking-[0.2em] text-stone-500 transition-colors hover:text-amber-200 ${className}`}
    >
      Roster
    </Link>
  );
}

/** Holds the button's height so the logo above it never shifts. */
export function HomeCtaFallback() {
  return (
    <div aria-hidden className="flex flex-col items-center">
      <div className="h-[46px] w-44 animate-pulse rounded-full bg-stone-800/80" />
      <div className="mt-4 h-3 w-56 animate-pulse rounded bg-stone-900" />
      <div className="mt-7 h-8 w-48 animate-pulse rounded-full bg-stone-900" />
    </div>
  );
}
