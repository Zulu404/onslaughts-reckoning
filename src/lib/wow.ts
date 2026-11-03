// Class colours and icons carried over from the No Meta asset database.
// The class, role and profession lists match the guild's own roster sheet:
// nine classes, three roles, and the nine primary professions, i.e. no
// Jewelcrafting or Inscription.

export const ROLES = ["Tank", "Heal", "Damage"] as const;
export type Role = (typeof ROLES)[number];

export interface WowClass {
  name: string;
  slug: string;
  color: string;
  roles: Role[];
}

export const CLASSES: WowClass[] = [
  { name: "Druid", slug: "druid", color: "#ff7d0a", roles: ["Tank", "Heal", "Damage"] },
  { name: "Hunter", slug: "hunter", color: "#aad372", roles: ["Damage"] },
  { name: "Mage", slug: "mage", color: "#69ccf0", roles: ["Damage"] },
  { name: "Paladin", slug: "paladin", color: "#f58cba", roles: ["Tank", "Heal", "Damage"] },
  { name: "Priest", slug: "priest", color: "#ffffff", roles: ["Heal", "Damage"] },
  { name: "Rogue", slug: "rogue", color: "#fff569", roles: ["Damage"] },
  { name: "Shaman", slug: "shaman", color: "#0070de", roles: ["Heal", "Damage"] },
  { name: "Warlock", slug: "warlock", color: "#9482c9", roles: ["Damage"] },
  { name: "Warrior", slug: "warrior", color: "#c79c6e", roles: ["Tank", "Damage"] },
];

export const PROFESSIONS = [
  "Alchemy",
  "Blacksmithing",
  "Enchanting",
  "Engineering",
  "Herbalism",
  "Leatherworking",
  "Mining",
  "Skinning",
  "Tailoring",
] as const;

const BY_NAME = new Map(CLASSES.map((c) => [c.name, c]));

export function getClass(name: string | null | undefined): WowClass | undefined {
  return name ? BY_NAME.get(name) : undefined;
}

/** Falls back to parchment rather than leaving a name unstyled on bad data. */
export function classColor(name: string | null | undefined): string {
  return getClass(name)?.color ?? "#e8e4d8";
}

export function classIcon(name: string | null | undefined): string | null {
  const slug = getClass(name)?.slug;
  return slug ? `/wow/class/${slug}.png` : null;
}

export function isValidClass(name: string): boolean {
  return BY_NAME.has(name);
}

export function isValidRole(role: string): role is Role {
  return (ROLES as readonly string[]).includes(role);
}

/** Guards against a Druid being saved as a Mage tank if the form is bypassed. */
export function classCanFillRole(className: string, role: string): boolean {
  const c = getClass(className);
  return !!c && c.roles.includes(role as Role);
}

export function isValidProfession(p: string): boolean {
  return (PROFESSIONS as readonly string[]).includes(p);
}
