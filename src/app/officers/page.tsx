import { Suspense } from "react";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import PanelSkeleton from "@/components/PanelSkeleton";
import OfficersBody from "./OfficersBody";

export const metadata: Metadata = {
  title: "Officers — Onslaught's Reckoning",
  robots: { index: false, follow: false },
};

export default function OfficersPage() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-5 py-10">
        <h1 className="font-display text-2xl uppercase tracking-[0.18em] text-amber-200/90">
          Officers
        </h1>

        <Suspense fallback={<PanelSkeleton rows={4} />}>
          <OfficersBody />
        </Suspense>
      </main>
    </>
  );
}
