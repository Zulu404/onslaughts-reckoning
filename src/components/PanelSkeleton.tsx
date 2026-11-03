/** Placeholder for a Suspense boundary that is waiting on the session. */
export default function PanelSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div aria-hidden>
      <div className="h-7 w-48 animate-pulse rounded bg-stone-800" />
      <div className="panel mt-6 space-y-3 p-5">
        {Array.from({ length: rows }, (_, i) => (
          <div
            key={i}
            className="h-4 animate-pulse rounded bg-stone-800"
            style={{ width: `${85 - i * 15}%` }}
          />
        ))}
      </div>
    </div>
  );
}
