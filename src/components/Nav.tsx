"use client";

import { useState } from "react";

const links = [
  { label: "About", href: "#about" },
  { label: "Guild Values", href: "#pillars" },
  { label: "Recruitment", href: "#recruitment" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-[#1e1e2e] bg-[#0a0a0f]/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#" className="font-display text-sm font-semibold tracking-widest text-[#c9a84c] uppercase">
          Onslaught&apos;s Reckoning
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm tracking-wide text-stone-400 hover:text-[#c9a84c] transition-colors duration-200"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#recruitment"
            className="rounded border border-[#c9a84c]/60 px-4 py-1.5 text-sm font-display tracking-widest text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-colors duration-200"
          >
            Apply
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-stone-400 hover:text-[#c9a84c] transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[#1e1e2e] bg-[#0a0a0f]/95 px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm tracking-wide text-stone-400 hover:text-[#c9a84c] transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#recruitment"
            onClick={() => setOpen(false)}
            className="self-start rounded border border-[#c9a84c]/60 px-4 py-1.5 text-sm font-display tracking-widest text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-colors"
          >
            Apply
          </a>
        </div>
      )}
    </header>
  );
}
