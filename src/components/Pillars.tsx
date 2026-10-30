const pillars = [
  {
    icon: "⚔️",
    title: "Progression",
    description:
      "We push content seriously. Show up prepared, know the fights, and help the team grow. CE is the goal; consistency is the requirement.",
  },
  {
    icon: "🛡️",
    title: "Brotherhood",
    description:
      "We've raided together through multiple expansions. We celebrate wins together and weather the wipes. No drama, no ego — just trust.",
  },
  {
    icon: "🔥",
    title: "Longevity",
    description:
      "Forever means forever. We plan for the next tier and the expansion after that. Active roster, stable leadership, sustainable pace.",
  },
  {
    icon: "🌟",
    title: "Growth",
    description:
      "We invest in our players. Log reviews, coaching, and an environment where asking for help is a strength, not a weakness.",
  },
];

export default function Pillars() {
  return (
    <section id="pillars" className="py-24 px-6 bg-[#0d0d14]">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="gold-line flex-1" />
          <h2 className="font-display text-xs tracking-[0.3em] text-[#c9a84c] uppercase shrink-0">
            Guild Values
          </h2>
          <div className="gold-line flex-1" />
        </div>

        <p className="text-center text-stone-500 text-sm mb-14">
          What we stand for, every tier, every expansion.
        </p>

        <div className="grid sm:grid-cols-2 gap-6">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="rounded-lg border border-[#1e1e2e] bg-[#12121a] p-6 hover:border-[#c9a84c]/30 transition-colors duration-300"
            >
              <div className="text-2xl mb-3">{p.icon}</div>
              <h3 className="font-display text-base font-semibold tracking-wide text-stone-100 mb-2">
                {p.title}
              </h3>
              <p className="text-stone-400 text-sm leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
