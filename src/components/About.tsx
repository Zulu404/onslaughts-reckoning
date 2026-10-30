export default function About() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-12">
          <div className="gold-line flex-1" />
          <h2 className="font-display text-xs tracking-[0.3em] text-[#c9a84c] uppercase shrink-0">
            Our Story
          </h2>
          <div className="gold-line flex-1" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="font-display text-3xl sm:text-4xl font-bold text-stone-100 leading-tight mb-6">
              A guild built for the long haul
            </h3>
            <p className="text-stone-400 leading-relaxed mb-4">
              Onslaught&apos;s Reckoning is a forever guild &mdash; we&apos;re
              not here for a single tier or a fleeting meta. We&apos;ve been
              through expansions together, and we&apos;ll be here for whatever
              comes next.
            </p>
            <p className="text-stone-400 leading-relaxed">
              Whether you&apos;re a seasoned raider chasing Cutting Edge or a
              player looking for a community to call home between patches, you
              belong here. We balance competitive progression with the
              understanding that real life comes first.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Realm", value: "TBD" },
              { label: "Faction", value: "TBD" },
              { label: "Raid Schedule", value: "TBD" },
              { label: "Focus", value: "Progression + Community" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-[#1e1e2e] bg-[#12121a] p-5"
              >
                <p className="font-display text-xs tracking-widest text-[#c9a84c] uppercase mb-1">
                  {stat.label}
                </p>
                <p className="text-stone-200 font-semibold">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
