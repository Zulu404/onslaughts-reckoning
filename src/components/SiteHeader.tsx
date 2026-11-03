import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import AccountNav, { AccountNavFallback } from "./AccountNav";

/**
 * Static apart from the account links: everything here prerenders into the
 * shell, and only the signed-in state streams in.
 */
export default function SiteHeader() {
  return (
    <header className="relative z-20 border-b border-orange-900/30 bg-black/60 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-5 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo.jpg"
            alt=""
            width={1253}
            height={1254}
            className="h-8 w-8 select-none"
            style={{ mixBlendMode: "screen" }}
          />
          <span className="font-display text-xs uppercase tracking-[0.2em] text-amber-200/90 sm:text-sm">
            Onslaught&apos;s Reckoning
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-4 text-xs uppercase tracking-[0.14em] text-stone-400">
          <Link href="/roster" className="transition-colors hover:text-amber-200">
            Roster
          </Link>
          <Suspense fallback={<AccountNavFallback />}>
            <AccountNav />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}
