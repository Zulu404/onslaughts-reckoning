import Link from "next/link";
import CharacterBadge, { ClassIcon } from "@/components/wow/CharacterBadge";
import RoleIcon from "@/components/wow/RoleIcon";
import { getRoster, type RosterEntry } from "@/lib/dal";
import { CLASSES, ROLES } from "@/lib/wow";
import { authConfigured } from "@/lib/supabase/config";

function Tallies({ mains }: { mains: RosterEntry[] }) {
  const byClass = CLASSES.map((c) => ({
    ...c,
    count: mains.filter((m) => m.class === c.name).length,
  })).filter((c) => c.count > 0);

  const byRole = ROLES.map((r) => ({
    role: r,
    count: mains.filter((m) => m.role === r).length,
  })).filter((r) => r.count > 0);

  return (
    <div className="panel mt-6 grid gap-6 p-5 sm:grid-cols-2">
      <div>
        <h2 className="label">Main classes</h2>
        <ul className="mt-2 space-y-1.5">
          {byClass.map((c) => (
            <li key={c.slug} className="flex items-center gap-2 text-sm">
              <ClassIcon className={c.name} size={18} />
              <span style={{ color: c.color }}>{c.name}</span>
              <span className="ml-auto tabular-nums text-stone-400">
                {c.count}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="label">Main roles</h2>
        <ul className="mt-2 space-y-1.5">
          {byRole.map((r) => (
            <li key={r.role} className="flex items-center gap-2 text-sm">
              <RoleIcon role={r.role} size={16} className="text-stone-400" />
              <span className="text-stone-200">{r.role}</span>
              <span className="ml-auto tabular-nums text-stone-400">
                {r.count}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-stone-500">
          {mains.length} {mains.length === 1 ? "member" : "members"} on the
          roster.
        </p>
      </div>
    </div>
  );
}

function CharacterList({
  entries,
  emptyText,
}: {
  entries: RosterEntry[];
  emptyText: string;
}) {
  if (entries.length === 0) {
    return <p className="py-3 text-sm text-stone-500">{emptyText}</p>;
  }

  return (
    <ul className="mt-1">
      {entries.map((e) => (
        <li
          key={e.id}
          className="flex flex-wrap items-center gap-3 border-b border-stone-800/70 py-3 last:border-0"
        >
          <CharacterBadge
            name={e.name}
            surname={e.surname}
            wowClass={e.class}
            role={e.role}
          />
          {e.planned && (
            <span className="rounded-full border border-stone-700 px-2 py-0.5 text-[10px] uppercase tracking-wider text-stone-400">
              Planned
            </span>
          )}
          {e.professions.length > 0 && (
            <span className="text-xs text-stone-500">
              {e.professions.join(" · ")}
            </span>
          )}
          {e.discord_username && (
            <span className="ml-auto text-xs text-stone-600">
              {e.discord_username}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

export default async function RosterBody() {
  const roster = await getRoster();
  const mains = roster.filter((e) => e.is_main);
  const alts = roster.filter((e) => !e.is_main);

  if (!authConfigured || roster.length === 0) {
    return (
      <div className="panel mt-6 p-6">
        <p className="text-stone-300">
          The roster is empty while we gather members for launch.{" "}
          <Link
            href="/join"
            className="text-amber-200 underline-offset-2 hover:underline"
          >
            Register your character
          </Link>{" "}
          to be among the first.
        </p>
      </div>
    );
  }

  return (
    <>
      <Tallies mains={mains} />

      <section className="panel mt-6 p-5">
        <h2 className="label">Mains</h2>
        <CharacterList entries={mains} emptyText="No mains yet." />
      </section>

      <section className="panel mt-6 p-5">
        <h2 className="label">Alts</h2>
        <CharacterList entries={alts} emptyText="No alts registered yet." />
      </section>
    </>
  );
}
