import { Suspense } from "react";
import type { Metadata } from "next";
import HubShell, { PageTitle } from "@/components/hub/HubShell";
import RosterBody from "./RosterBody";

export const metadata: Metadata = {
  title: "Roster — Onslaught's Reckoning",
  description:
    "The guild roster for Onslaught's Reckoning, an EU Horde PvP guild on WoW Forever.",
};

function RosterSkeleton() {
  return (
    <div aria-hidden className="panel space-y-3 p-5">
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
    <HubShell>
      <main className="mx-auto max-w-3xl px-5 py-8">
        {/* Heading is static and prerenders; only the roster data streams. */}
        <PageTitle subtitle="EU · Horde · PvP ruleset">Roster</PageTitle>

        <Suspense fallback={<RosterSkeleton />}>
          <RosterBody />
        </Suspense>
      </main>
    </HubShell>
  );
}
