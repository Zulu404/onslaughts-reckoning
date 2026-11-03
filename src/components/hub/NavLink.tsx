"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Client-side only so the active item can be derived from the URL. */
export default function NavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
        active
          ? "bg-orange-950/40 text-amber-100 shadow-[inset_2px_0_0_0_#dc3005]"
          : "text-stone-400 hover:bg-stone-900/60 hover:text-stone-100"
      }`}
    >
      {label}
    </Link>
  );
}
