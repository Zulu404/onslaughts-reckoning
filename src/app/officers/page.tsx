import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import { getMember } from "@/lib/dal";
import OfficersBody from "./OfficersBody";

export const metadata: Metadata = {
  title: "Officers — Onslaught's Reckoning",
  robots: { index: false, follow: false },
};

/**
 * Deliberately not an instant route. The officer check has to run before any
 * markup is flushed, otherwise notFound() cannot set a 404 status and a
 * non-officer gets 200 plus the page heading. Instant navigation is worth
 * nothing on an officer-only page anyway.
 */
export const instant = false;

export default async function OfficersPage() {
  const me = await getMember();
  // 404 rather than redirect, so the page's existence isn't advertised.
  if (!me?.is_officer) notFound();

  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-5 py-10">
        <h1 className="font-display text-2xl uppercase tracking-[0.18em] text-amber-200/90">
          Officers
        </h1>

        <OfficersBody />
      </main>
    </>
  );
}
