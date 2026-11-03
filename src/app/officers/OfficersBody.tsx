import { notFound } from "next/navigation";
import CharacterBadge from "@/components/wow/CharacterBadge";
import { getApplicants, getMember, type Applicant } from "@/lib/dal";
import { setStatus } from "./actions";

const STATUS_STYLE: Record<string, string> = {
  pending: "border-amber-700/50 text-amber-200",
  accepted: "border-emerald-800/60 text-emerald-200",
  rejected: "border-red-900/60 text-red-200",
};

function ApplicantCard({ applicant }: { applicant: Applicant }) {
  const characters = [...(applicant.characters ?? [])].sort(
    (a, b) => Number(b.is_main) - Number(a.is_main),
  );

  return (
    <section className="panel p-5">
      <header className="flex flex-wrap items-center gap-3">
        <h3 className="text-base font-semibold text-stone-100">
          {applicant.discord_username ?? applicant.discord_id}
        </h3>
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${
            STATUS_STYLE[applicant.status] ?? ""
          }`}
        >
          {applicant.status}
        </span>
        {applicant.is_officer && (
          <span className="rounded-full border border-orange-700/60 px-2 py-0.5 text-[10px] uppercase tracking-wider text-orange-300">
            Officer
          </span>
        )}
        <span className="ml-auto text-xs text-stone-600">
          Applied {new Date(applicant.created_at).toLocaleDateString("en-GB")}
        </span>
      </header>

      <ul className="mt-3">
        {characters.length === 0 ? (
          <li className="py-2 text-sm text-stone-500">
            Signed in but hasn&apos;t registered a character yet.
          </li>
        ) : (
          characters.map((c) => (
            <li
              key={c.id}
              className="flex flex-wrap items-center gap-3 border-b border-stone-800/70 py-2.5 last:border-0"
            >
              <CharacterBadge
                name={c.name}
                surname={c.surname}
                wowClass={c.class}
                role={c.role}
              />
              <span className="rounded-full border border-stone-700 px-2 py-0.5 text-[10px] uppercase tracking-wider text-stone-400">
                {c.is_main ? "Main" : "Alt"}
              </span>
              {c.planned && (
                <span className="text-[10px] uppercase tracking-wider text-stone-500">
                  Planned
                </span>
              )}
              {c.professions.length > 0 && (
                <span className="text-xs text-stone-500">
                  {c.professions.join(" · ")}
                </span>
              )}
            </li>
          ))
        )}
      </ul>

      {applicant.officer_note && (
        <p className="mt-3 text-sm italic text-stone-400">
          Note: {applicant.officer_note}
        </p>
      )}

      <form
        action={setStatus.bind(
          null,
          applicant.id,
          applicant.status === "accepted" ? "rejected" : "accepted",
        )}
        className="mt-4 flex flex-wrap items-center gap-3"
      >
        <input
          name="note"
          className="field sm:max-w-xs"
          placeholder="Note for the applicant (optional)"
          maxLength={280}
        />
        <button
          type="submit"
          className={`btn ${
            applicant.status === "accepted" ? "btn-ghost" : "btn-ember"
          }`}
        >
          {applicant.status === "accepted" ? "Revoke" : "Accept"}
        </button>
      </form>
    </section>
  );
}

export default async function OfficersBody() {
  const me = await getMember();
  // 404 rather than redirect, so the page's existence isn't advertised.
  if (!me?.is_officer) notFound();

  const applicants = await getApplicants();
  const pending = applicants.filter((a) => a.status === "pending");
  const decided = applicants.filter((a) => a.status !== "pending");

  return (
    <>
      <p className="mt-2 text-sm text-stone-400">
        {pending.length} awaiting review · {applicants.length} total
      </p>

      <h2 className="label mt-8">Awaiting review</h2>
      {pending.length === 0 ? (
        <p className="mt-2 text-sm text-stone-500">
          Nothing to review right now.
        </p>
      ) : (
        <div className="mt-2 space-y-4">
          {pending.map((a) => (
            <ApplicantCard key={a.id} applicant={a} />
          ))}
        </div>
      )}

      {decided.length > 0 && (
        <>
          <h2 className="label mt-10">Decided</h2>
          <div className="mt-2 space-y-4">
            {decided.map((a) => (
              <ApplicantCard key={a.id} applicant={a} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
