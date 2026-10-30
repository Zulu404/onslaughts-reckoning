const openRoles = [
  { role: "Tank", status: "Closed", note: "Full — exceptional applicants considered" },
  { role: "Healer", status: "Open", note: "All specs reviewed" },
  { role: "Melee DPS", status: "Open", note: "All specs reviewed" },
  { role: "Ranged DPS", status: "Open", note: "All specs reviewed" },
  { role: "Social / Casual", status: "Open", note: "Always welcoming community members" },
];

const statusColor: Record<string, string> = {
  Open: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  Closed: "text-rose-400 border-rose-400/30 bg-rose-400/10",
};

export default function Recruitment() {
  return (
    <section id="recruitment" className="py-24 px-6">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="gold-line flex-1" />
          <h2 className="font-display text-xs tracking-[0.3em] text-[#c9a84c] uppercase shrink-0">
            Recruitment
          </h2>
          <div className="gold-line flex-1" />
        </div>

        <p className="text-center text-stone-500 text-sm mb-14">
          Looking for a home? We&apos;re looking for you.
        </p>

        <div className="rounded-xl border border-[#1e1e2e] bg-[#12121a] overflow-hidden mb-10">
          <div className="border-b border-[#1e1e2e] px-6 py-3 grid grid-cols-3 text-xs font-display tracking-widest text-stone-500 uppercase">
            <span>Role</span>
            <span>Status</span>
            <span>Notes</span>
          </div>
          {openRoles.map((r) => (
            <div
              key={r.role}
              className="px-6 py-4 grid grid-cols-3 items-center border-b border-[#1e1e2e] last:border-0 hover:bg-white/[0.02] transition-colors"
            >
              <span className="font-display text-sm text-stone-200 font-semibold">
                {r.role}
              </span>
              <span>
                <span
                  className={`inline-block rounded border px-2 py-0.5 text-xs font-medium ${statusColor[r.status]}`}
                >
                  {r.status}
                </span>
              </span>
              <span className="text-stone-500 text-sm">{r.note}</span>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-[#c9a84c]/20 bg-[#c9a84c]/5 p-8 text-center">
          <h3 className="font-display text-xl font-bold text-stone-100 mb-3">
            Ready to join the Reckoning?
          </h3>
          <p className="text-stone-400 text-sm mb-6 max-w-md mx-auto">
            Fill out our application and an officer will reach out within 48
            hours. Tell us your class, spec, logs, and why you want to raid with
            us.
          </p>
          <a
            href="#"
            className="inline-block rounded border border-[#c9a84c] px-8 py-3 font-display text-sm tracking-widest text-[#c9a84c] uppercase hover:bg-[#c9a84c]/10 transition-colors duration-200"
          >
            Submit Application
          </a>
          <p className="mt-4 text-xs text-stone-600">
            Applications link coming soon &mdash; reach out on Discord in the meantime.
          </p>
        </div>
      </div>
    </section>
  );
}
