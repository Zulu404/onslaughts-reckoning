export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Background radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(139,26,26,0.18) 0%, rgba(10,10,15,0) 70%)",
        }}
      />

      {/* Decorative top crest line */}
      <div className="mb-10 flex items-center gap-4 w-full max-w-md">
        <div className="gold-line flex-1" />
        <svg
          className="h-5 w-5 shrink-0 text-[#c9a84c]"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
        </svg>
        <div className="gold-line flex-1" />
      </div>

      <p className="font-display text-xs tracking-[0.3em] text-[#c9a84c] uppercase mb-4">
        World of Warcraft &mdash; Forever Guild
      </p>

      <h1 className="font-display text-5xl sm:text-7xl font-black tracking-tight text-stone-100 leading-none mb-2">
        Onslaught&apos;s
      </h1>
      <h1 className="font-display text-5xl sm:text-7xl font-black tracking-tight text-[#c9a84c] leading-none mb-8">
        Reckoning
      </h1>

      <p className="max-w-xl text-base sm:text-lg text-stone-400 leading-relaxed mb-10">
        We raid. We conquer. We endure. A tight-knit community built to last
        through every expansion&nbsp;&mdash; from progression nights to casual
        evenings in Azeroth.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="#recruitment"
          className="rounded border border-[#c9a84c] px-8 py-3 font-display text-sm tracking-widest text-[#c9a84c] uppercase hover:bg-[#c9a84c]/10 transition-colors duration-200"
        >
          Apply to Join
        </a>
        <a
          href="#about"
          className="rounded border border-stone-700 px-8 py-3 font-display text-sm tracking-widest text-stone-400 uppercase hover:border-stone-500 hover:text-stone-200 transition-colors duration-200"
        >
          Learn More
        </a>
      </div>

      {/* Bottom divider */}
      <div className="mt-20 gold-line w-full max-w-md" />
    </section>
  );
}
