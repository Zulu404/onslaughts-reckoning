import "server-only";

import { cache } from "react";
import { createClient } from "./supabase/server";
import { authConfigured } from "./supabase/config";

export interface Member {
  id: string;
  discord_id: string;
  discord_username: string | null;
  discord_avatar: string | null;
  status: "pending" | "accepted" | "rejected";
  is_officer: boolean;
  officer_note: string | null;
  created_at: string;
}

export interface Character {
  id: string;
  member_id: string;
  name: string;
  surname: string | null;
  class: string;
  role: string;
  professions: string[];
  is_main: boolean;
  planned: boolean;
  created_at: string;
}

export interface RosterEntry extends Omit<Character, "created_at"> {
  discord_username: string | null;
  discord_avatar: string | null;
}

/**
 * getUser() revalidates the token against the auth server, unlike getSession()
 * which trusts whatever is in the cookie. Everything downstream of this is an
 * authorization decision, so it has to be the checked one.
 */
export const getUser = cache(async () => {
  if (!authConfigured) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  // A missing session is normal and not worth logging; anything else is not.
  if (error && error.name !== "AuthSessionMissingError") {
    console.error("[dal.getUser]", error.message);
  }
  return data?.user ?? null;
});

export const getMember = cache(async (): Promise<Member | null> => {
  const user = await getUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("members")
    .select(
      "id, discord_id, discord_username, discord_avatar, status, is_officer, officer_note, created_at",
    )
    .eq("user_id", user.id)
    .maybeSingle();

  // Logged so a broken query is distinguishable from a genuinely absent row,
  // which the pages render very differently.
  if (error) console.error("[dal.getMember]", error.message);

  return (data as Member | null) ?? null;
});

export const getMyCharacters = cache(async (): Promise<Character[]> => {
  const member = await getMember();
  if (!member) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("characters")
    .select("*")
    .eq("member_id", member.id)
    .order("is_main", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) console.error("[dal.getMyCharacters]", error.message);

  return (data as Character[] | null) ?? [];
});

/** Reads the public view, so it works for signed-out visitors too. */
export const getRoster = cache(async (): Promise<RosterEntry[]> => {
  if (!authConfigured) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("roster")
    .select("*")
    .order("is_main", { ascending: false })
    .order("name", { ascending: true });

  if (error) console.error("[dal.getRoster]", error.message);

  return (data as RosterEntry[] | null) ?? [];
});

export interface Applicant extends Member {
  characters: Character[];
}

/** Officer view. Returns empty for anyone who is not an officer: the row level
 *  security policies filter it, so this is not relying on the UI to hide it. */
export const getApplicants = cache(async (): Promise<Applicant[]> => {
  const member = await getMember();
  if (!member?.is_officer) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("members")
    .select(
      "id, discord_id, discord_username, discord_avatar, status, is_officer, officer_note, created_at, characters(*)",
    )
    .order("created_at", { ascending: true });

  if (error) console.error("[dal.getApplicants]", error.message);

  return (data as Applicant[] | null) ?? [];
});
