import { Suspense } from "react";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import RosterBody from "./RosterBody";

export const metadata: Metadata = {
  title: "Roster — Onslaught's Reckoning",
  description:
    "The guild roster for Onslaught's Reckoning, an EU Horde PvP guild on WoW Forever.",
};

function RosterSkeleton() {
  return (
    <div aria-hidden className="panel mt-6 space-y-3 p-5">
      {[85, 70, 78, 60].map((w, i) => (
        <div
          key={i}
          className="h-4 animate-pulse rounded bg-stone-800"
          style={{ width: `${w}%` }}
        />
      ))}
    </div>
  );
}

export default function RosterPage() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-5 py-10">
        {/* Heading is static and prerenders; only the roster data streams. */}
        <h1 className="font-display text-2xl uppercase tracking-[0.18em] text-amber-200/90">
          Roster
        </h1>
        <p className="mt-2 text-sm text-stone-400">EU · Horde · PvP ruleset</p>

        <Suspense fallback={<RosterSkeleton />}>
          <RosterBody />
        </Suspense>
      </main>
    </>
  );
}
