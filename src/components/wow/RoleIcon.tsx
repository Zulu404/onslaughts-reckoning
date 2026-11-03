// Drawn rather than imported: the No Meta asset set has no role icons, and
// vector shapes stay crisp at any size where a 24px raster would not.

const PATHS: Record<string, string> = {
  Tank: "M12 2.5 4.5 5.2v6.1c0 4.6 3.1 8.4 7.5 10.2 4.4-1.8 7.5-5.6 7.5-10.2V5.2L12 2.5Z",
  Heal: "M9.8 3h4.4v6.8H21v4.4h-6.8V21H9.8v-6.8H3V9.8h6.8V3Z",
  Damage:
    "M13.3 14.6 19.4 4.3 20.9 3l-1.3 1.6-10.3 6.1 4 3.9ZM7.9 12.3 3 19.6 4.4 21l7.3-4.9-3.8-3.8Z",
};

export default function RoleIcon({
  role,
  size = 16,
  className = "",
}: {
  role: string;
  size?: number;
  className?: string;
}) {
  const path = PATHS[role];
  if (!path) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      focusable="false"
      className={className}
    >
      <path d={path} />
    </svg>
  );
}
