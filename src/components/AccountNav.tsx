import Link from "next/link";
import { getMember, getUser } from "@/lib/dal";
import { signOut } from "@/app/auth/actions";

const linkClass = "transition-colors hover:text-amber-200";

/** Reads the session, so it always renders behind a Suspense boundary. */
export default async function AccountNav() {
  const user = await getUser();
  const member = user ? await getMember() : null;

  return (
    <>
      <Link href="/join" className={linkClass}>
        {member ? "My Characters" : "Register"}
      </Link>
      {member?.is_officer && (
        <Link href="/officers" className={linkClass}>
          Officers
        </Link>
      )}
      {user && (
        <form action={signOut}>
          <button
            type="submit"
            className={`cursor-pointer uppercase tracking-[0.14em] ${linkClass}`}
          >
            Sign Out
          </button>
        </form>
      )}
    </>
  );
}

/** Holds the row height while the session resolves, to avoid a nav jump. */
export function AccountNavFallback() {
  return <span className="h-4 w-20 animate-pulse rounded bg-stone-800" />;
}
