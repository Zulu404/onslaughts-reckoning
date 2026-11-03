import Image from "next/image";
import { classColor, classIcon } from "@/lib/wow";
import RoleIcon from "./RoleIcon";

export function ClassIcon({
  className: wowClass,
  size = 20,
}: {
  className: string;
  size?: number;
}) {
  const src = classIcon(wowClass);
  const color = classColor(wowClass);

  // Unknown class: a coloured monogram keeps the row aligned instead of
  // collapsing the layout around a missing image.
  if (!src) {
    return (
      <span
        aria-hidden
        style={{
          width: size,
          height: size,
          color,
          borderColor: `${color}66`,
          backgroundColor: `${color}22`,
        }}
        className="inline-flex shrink-0 items-center justify-center rounded border text-[9px] font-bold"
      >
        {wowClass.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt=""
      width={25}
      height={24}
      style={{ width: size, height: size }}
      className="shrink-0 rounded object-contain"
    />
  );
}

/** Class icon, class-coloured name, and role — the standard roster row. */
export default function CharacterBadge({
  name,
  surname,
  wowClass,
  role,
  iconSize = 20,
  showRole = true,
}: {
  name: string;
  surname?: string | null;
  wowClass: string;
  role: string;
  iconSize?: number;
  showRole?: boolean;
}) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2">
      <ClassIcon className={wowClass} size={iconSize} />
      <span className="min-w-0 truncate font-medium" style={{ color: classColor(wowClass) }}>
        {name}
        {surname ? <span className="font-normal opacity-70"> {surname}</span> : null}
      </span>
      {showRole && (
        <span className="inline-flex shrink-0 items-center gap-1 text-xs text-stone-400">
          <RoleIcon role={role} size={13} />
          {role}
        </span>
      )}
    </span>
  );
}
