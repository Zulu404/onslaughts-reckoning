/**
 * Guild pages in the sidebar. Adding a future section — raids, progress,
 * loot — is a single entry here; nothing else needs to change.
 */
export interface NavItem {
  href: string;
  label: string;
}

export const GUILD_PAGES: NavItem[] = [{ href: "/roster", label: "Roster" }];
