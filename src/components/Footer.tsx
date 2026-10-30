export default function Footer() {
  return (
    <footer className="border-t border-[#1e1e2e] py-10 px-6">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-display text-xs tracking-widest text-[#c9a84c] uppercase">
          Onslaught&apos;s Reckoning
        </p>
        <p className="text-xs text-stone-600">
          World of Warcraft is a trademark of Blizzard Entertainment.
        </p>
        <div className="flex gap-6">
          {/* Placeholder social links — swap hrefs when ready */}
          <a
            href="#"
            className="text-stone-600 hover:text-[#c9a84c] text-xs transition-colors"
          >
            Discord
          </a>
          <a
            href="#"
            className="text-stone-600 hover:text-[#c9a84c] text-xs transition-colors"
          >
            Warcraftlogs
          </a>
          <a
            href="#"
            className="text-stone-600 hover:text-[#c9a84c] text-xs transition-colors"
          >
            Raider.IO
          </a>
        </div>
      </div>
    </footer>
  );
}
