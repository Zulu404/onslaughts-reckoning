import { Suspense } from "react";
import type { Metadata } from "next";
import HubShell, { PageTitle } from "@/components/hub/HubShell";
import PanelSkeleton from "@/components/PanelSkeleton";
import JoinBody from "./JoinBody";

export const metadata: Metadata = {
  title: "My Characters — Onslaught's Reckoning",
  description:
    "Sign in with Discord and register your character with Onslaught's Reckoning.",
};

export default function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <HubShell>
      <main className="mx-auto max-w-3xl px-5 py-8">
        <PageTitle>My Characters</PageTitle>

        {/* The session and searchParams are request data, so the whole body
            streams in behind this boundary while the shell renders at once. */}
        <Suspense fallback={<PanelSkeleton rows={3} />}>
          <JoinBody searchParams={searchParams} />
        </Suspense>
      </main>
    </HubShell>
  );
}
