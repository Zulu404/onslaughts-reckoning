import Link from "next/link";
import CharacterBadge from "@/components/wow/CharacterBadge";
import { getMember, getMyCharacters, getUser, type Character } from "@/lib/dal";
import { authConfigured } from "@/lib/supabase/config";
import { signInWithDiscord } from "@/app/auth/actions";
import CharacterForm from "./CharacterForm";
import { deleteCharacter, setMainCharacter } from "./actions";

const ERRORS: Record<string, string> = {
  unconfigured: "Registration isn't switched on yet. Check back shortly.",
  signin: "Discord sign-in couldn't be started. Please try again.",
  callback: "Discord didn't send us back a sign-in code. Please try again.",
  exchange: "That sign-in link has expired. Please try again.",
  profile: "You're signed in, but we couldn't create your profile.",
};

const STATUS_COPY = {
  pending: {
    title: "Application received",
    body: "An officer will review your characters and get back to you on Discord.",
    tone: "border-amber-700/50 bg-amber-950/30 text-amber-100",
  },
  accepted: {
    title: "You're in",
    body: "Your characters appear on the public roster. Keep them up to date here.",
    tone: "border-emerald-800/50 bg-emerald-950/30 text-emerald-100",
  },
  rejected: {
    title: "Not accepted",
    body: "Speak to an officer on Discord if you think this is a mistake.",
    tone: "border-red-900/60 bg-red-950/30 text-red-100",
  },
} as const;

function CharacterRow({ character }: { character: Character }) {
  return (
    <li className="flex flex-wrap items-center gap-3 border-b border-stone-800/70 py-3 last:border-0">
      <CharacterBadge
        name={character.name}
        surname={character.surname}
        wowClass={character.class}
        role={character.role}
      />

      {character.planned && (
        <span className="rounded-full border border-stone-700 px-2 py-0.5 text-[10px] uppercase tracking-wider text-stone-400">
          Planned
        </span>
      )}

      {character.professions.length > 0 && (
        <span className="text-xs text-stone-500">
          {character.professions.join(" · ")}
        </span>
      )}

      <span className="ml-auto flex items-center gap-3 text-xs">
        {!character.is_main && (
          <form action={setMainCharacter.bind(null, character.id)}>
            <button
              type="submit"
              className="cursor-pointer text-stone-400 underline-offset-2 transition-colors hover:text-amber-200 hover:underline"
            >
              Make main
            </button>
          </form>
        )}
        <form action={deleteCharacter.bind(null, character.id)}>
          <button
            type="submit"
            className="cursor-pointer text-stone-600 underline-offset-2 transition-colors hover:text-red-300 hover:underline"
          >
            Remove
          </button>
        </form>
      </span>
    </li>
  );
}

export default async function JoinBody({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const user = await getUser();
  const member = user ? await getMember() : null;
  const characters = member ? await getMyCharacters() : [];

  const main = characters.find((c) => c.is_main);
  const alts = characters.filter((c) => !c.is_main);

  return (
    <>
      {/* Inside the boundary because the wording depends on the session. */}
      <h1 className="font-display text-2xl uppercase tracking-[0.18em] text-amber-200/90">
        {member ? "Your Characters" : "Register"}
      </h1>

      {error && ERRORS[error] && (
        <p className="mt-4 rounded border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {ERRORS[error]}
        </p>
      )}

      {/* Supabase not configured yet: the landing page stays live regardless. */}
      {!authConfigured ? (
        <div className="panel mt-6 p-6">
          <p className="text-stone-300">
            Character registration is being set up and will open shortly. In the
            meantime, join us on Discord.
          </p>
          <a
            href="https://discord.gg/mus9eEwXh"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ember mt-5"
          >
            Join Our Discord
          </a>
        </div>
      ) : !user ? (
        <div className="panel mt-6 p-6">
          <p className="text-stone-300">
            Sign in with Discord to register your main and any alts you plan to
            roll. We use Discord so officers know who to contact.
          </p>
          <form action={signInWithDiscord} className="mt-5">
            <button type="submit" className="btn btn-ember">
              Sign in with Discord
            </button>
          </form>
          <p className="mt-4 text-xs text-stone-500">
            We only read your Discord username and avatar.
          </p>
        </div>
      ) : !member ? (
        <div className="panel mt-6 p-6">
          <p className="text-stone-300">
            You&apos;re signed in, but your profile hasn&apos;t been created
            yet. Try signing in again, and tell an officer if it keeps
            happening.
          </p>
          <form action={signInWithDiscord} className="mt-5">
            <button type="submit" className="btn btn-ghost">
              Retry sign-in
            </button>
          </form>
        </div>
      ) : (
        <>
          <div
            className={`mt-6 rounded-lg border px-4 py-3 ${STATUS_COPY[member.status].tone}`}
          >
            <p className="text-sm font-semibold">
              {STATUS_COPY[member.status].title}
            </p>
            <p className="mt-0.5 text-sm opacity-90">
              {STATUS_COPY[member.status].body}
            </p>
            {member.officer_note && (
              <p className="mt-2 text-sm italic opacity-80">
                Officer note: {member.officer_note}
              </p>
            )}
          </div>

          <p className="mt-4 text-sm text-stone-500">
            Signed in as{" "}
            <span className="text-stone-300">
              {member.discord_username ?? "your Discord account"}
            </span>
            .
          </p>

          {characters.length > 0 && (
            <section className="panel mt-6 p-5">
              <h2 className="label">Main</h2>
              <ul className="mt-1">
                {main ? (
                  <CharacterRow character={main} />
                ) : (
                  <li className="py-3 text-sm text-stone-500">No main set.</li>
                )}
              </ul>

              {alts.length > 0 && (
                <>
                  <h2 className="label mt-6">Alts</h2>
                  <ul className="mt-1">
                    {alts.map((c) => (
                      <CharacterRow key={c.id} character={c} />
                    ))}
                  </ul>
                </>
              )}
            </section>
          )}

          <div className="mt-6">
            <CharacterForm isFirst={characters.length === 0} />
          </div>

          <p className="mt-6 text-sm text-stone-500">
            <Link
              href="/roster"
              className="underline-offset-2 hover:text-amber-200 hover:underline"
            >
              See the full roster
            </Link>
          </p>
        </>
      )}
    </>
  );
}
