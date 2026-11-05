import Link from "next/link";
import CharacterBadge from "@/components/wow/CharacterBadge";
import { getMember, getMyCharacters, getUser, type Character } from "@/lib/dal";
import { authConfigured } from "@/lib/supabase/config";
import { signInWithDiscord } from "@/app/auth/actions";
import { DISCORD_INVITE } from "@/components/DiscordLink";
import CharacterForm from "./CharacterForm";
import { getClass } from "@/lib/wow";
import { deleteCharacter, setMainCharacter, updateCharacter } from "./actions";

const ERRORS: Record<string, string> = {
  unconfigured: "Registration isn't switched on yet. Check back shortly.",
  signin: "Discord sign-in couldn't be started. Please try again.",
  callback: "Discord didn't send us back a sign-in code. Please try again.",
  exchange: "That sign-in link has expired. Please try again.",
  profile: "You're signed in, but we couldn't create your profile.",
};

/**
 * Only the exceptional states get a banner. Registration no longer needs an
 * officer to approve it, so the ordinary accepted case says nothing rather
 * than showing a reassurance panel on every visit.
 */
const STATUS_COPY = {
  pending: {
    title: "Awaiting review",
    body: "An officer will take a look and get back to you on Discord.",
    tone: "border-amber-700/50 bg-amber-950/30 text-amber-100",
  },
  rejected: {
    title: "Not accepted",
    body: "Speak to an officer on Discord if you think this is a mistake.",
    tone: "border-red-900/60 bg-red-950/30 text-red-100",
  },
} as const;

function EditCharacterRow({
  character,
  invalid,
}: {
  character: Character;
  invalid?: string;
}) {
  // Roles come from the class, so a Warlock is never offered Tank. A class
  // with a single role still renders the field, which shows why it can't move.
  const roles = getClass(character.class)?.roles ?? [];

  return (
    <li className="border-b border-stone-800/70 py-3 last:border-0">
      <form
        action={updateCharacter.bind(null, character.id)}
        className="flex flex-wrap items-end gap-3"
      >
        <div>
          <label className="label" htmlFor={`name-${character.id}`}>
            Name
          </label>
          <input
            id={`name-${character.id}`}
            name="name"
            className="field !w-40"
            defaultValue={character.name}
            required
            minLength={2}
            maxLength={24}
            autoComplete="off"
            autoFocus
          />
        </div>
        <div>
          <label className="label" htmlFor={`surname-${character.id}`}>
            Surname
          </label>
          <input
            id={`surname-${character.id}`}
            name="surname"
            className="field !w-40"
            defaultValue={character.surname ?? ""}
            maxLength={24}
            autoComplete="off"
          />
        </div>
        <div>
          <label className="label" htmlFor={`role-${character.id}`}>
            Role
          </label>
          <select
            id={`role-${character.id}`}
            name="role"
            className="field !w-32"
            defaultValue={character.role}
            required
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-ember !py-2 !text-xs">
          Save
        </button>
        <Link
          href="/join"
          className="pb-2 text-xs text-stone-500 underline-offset-2 hover:text-stone-200 hover:underline"
        >
          Cancel
        </Link>
      </form>

      <p className="mt-2 text-xs text-stone-500">
        {character.class} can&apos;t be changed here. Roll a new character if
        you picked the wrong one.
      </p>

      {invalid && (
        <p className="mt-2 text-xs text-red-300">
          {invalid === "save"
            ? "Couldn't save that. Please try again."
            : invalid === "role"
              ? `Pick a role a ${character.class} can actually fill.`
              : "Name must be 2 to 24 characters, surname 24 or fewer."}
        </p>
      )}
    </li>
  );
}

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
        <Link
          href={`/join?edit=${character.id}`}
          className="text-stone-400 underline-offset-2 transition-colors hover:text-amber-200 hover:underline"
        >
          Edit
        </Link>
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
  searchParams: Promise<{ error?: string; edit?: string; invalid?: string }>;
}) {
  const { error, edit, invalid } = await searchParams;
  const user = await getUser();
  const member = user ? await getMember() : null;
  const characters = member ? await getMyCharacters() : [];

  const main = characters.find((c) => c.is_main);
  const alts = characters.filter((c) => !c.is_main);
  const banner =
    member && member.status !== "accepted"
      ? STATUS_COPY[member.status]
      : null;

  if (!authConfigured) {
    return (
      <div className="panel p-6">
        <p className="text-stone-300">
          Character registration is being set up and will open shortly. In the
          meantime, join us on Discord.
        </p>
        <a
          href={DISCORD_INVITE}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ember mt-5"
        >
          Join Our Discord
        </a>
      </div>
    );
  }

  return (
    <>
      {error && ERRORS[error] && (
        <p className="mb-4 rounded border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {ERRORS[error]}
        </p>
      )}

      {!user ? (
        <div className="panel p-6">
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
        <div className="panel p-6">
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
          {banner && (
            <div className={`mb-6 rounded-lg border px-4 py-3 ${banner.tone}`}>
              <p className="text-sm font-semibold">{banner.title}</p>
              <p className="mt-0.5 text-sm opacity-90">{banner.body}</p>
              {member.officer_note && (
                <p className="mt-2 text-sm italic opacity-80">
                  Officer note: {member.officer_note}
                </p>
              )}
            </div>
          )}

          {characters.length > 0 && (
            <section className="panel p-5">
              <h2 className="label">Main</h2>
              <ul className="mt-1">
                {main ? (
                  main.id === edit ? (
                    <EditCharacterRow character={main} invalid={invalid} />
                  ) : (
                    <CharacterRow character={main} />
                  )
                ) : (
                  <li className="py-3 text-sm text-stone-500">No main set.</li>
                )}
              </ul>

              {alts.length > 0 && (
                <>
                  <h2 className="label mt-6">Alts</h2>
                  <ul className="mt-1">
                    {alts.map((c) =>
                      c.id === edit ? (
                        <EditCharacterRow key={c.id} character={c} invalid={invalid} />
                      ) : (
                        <CharacterRow key={c.id} character={c} />
                      ),
                    )}
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
