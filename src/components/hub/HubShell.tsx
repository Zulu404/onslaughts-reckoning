import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import type { ReactNode } from "react";
import DiscordLink from "@/components/DiscordLink";
import SidebarUser, { SidebarUserFallback } from "./SidebarUser";
import NavLink from "./NavLink";
import { GUILD_PAGES } from "./nav-config";

/**
 * Shell for every page behind the landing page. The sidebar stacks above the
 * content on narrow screens and becomes a fixed column from lg upwards, so it
 * needs no JavaScript to be usable on a phone.
 */
export default function HubShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen lg:flex">
      <aside className="flex flex-col border-b border-orange-900/25 bg-[#0b0b0f]/80 backdrop-blur-sm lg:min-h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <Link
          href="/"
          className="flex items-center gap-2.5 border-b border-stone-900/80 px-3 py-3"
        >
          <Image
            src="/logo.jpg"
            alt=""
            width={1253}
            height={1254}
            className="h-7 w-7 select-none"
            style={{ mixBlendMode: "screen" }}
          />
          <span className="font-display text-[11px] uppercase tracking-[0.18em] text-amber-200/90">
            Onslaught&apos;s Reckoning
          </span>
        </Link>

        <Suspense fallback={<SidebarUserFallback />}>
          <SidebarUser />
        </Suspense>

        <nav className="border-t border-stone-900/80 px-2 py-3">
          <p className="label px-1">Guild</p>
          <div className="space-y-0.5">
            {GUILD_PAGES.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
          </div>
        </nav>

        <div className="mt-auto border-t border-stone-900/80 p-3">
          <DiscordLink className="w-full !px-3 !py-2 !text-xs" />
        </div>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

/** Consistent page heading inside the shell. */
export function PageTitle({
  children,
  subtitle,
}: {
  children: ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <h1 className="font-display text-2xl uppercase tracking-[0.18em] text-amber-200/90">
        {children}
      </h1>
      {subtitle && <p className="mt-2 text-sm text-stone-400">{subtitle}</p>}
    </div>
  );
}
