"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getMember } from "@/lib/dal";
import {
  classCanFillRole,
  isValidClass,
  isValidProfession,
  isValidRole,
} from "@/lib/wow";

export interface FormState {
  error?: string;
  ok?: boolean;
  /** Changes on every successful save; the form uses it as a remount key. */
  savedAt?: number;
}

/** Vanilla characters carry at most two primary professions. */
const MAX_PROFESSIONS = 2;

function refresh() {
  revalidatePath("/join");
  revalidatePath("/roster");
  revalidatePath("/officers");
}

export async function addCharacter(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  // Re-checked here rather than trusting the page that rendered the form.
  const member = await getMember();
  if (!member) return { error: "Sign in with Discord first." };

  const name = String(formData.get("name") ?? "").trim();
  const surname = String(formData.get("surname") ?? "").trim();
  const wowClass = String(formData.get("class") ?? "");
  const role = String(formData.get("role") ?? "");
  const planned = formData.get("planned") === "on";
  const professions = formData
    .getAll("professions")
    .map(String)
    .filter(isValidProfession);

  if (name.length < 2 || name.length > 24) {
    return { error: "Character name must be between 2 and 24 characters." };
  }
  if (surname.length > 24) {
    return { error: "Surname must be 24 characters or fewer." };
  }
  if (!isValidClass(wowClass)) return { error: "Pick a class." };
  if (!isValidRole(role)) return { error: "Pick a role." };
  if (!classCanFillRole(wowClass, role)) {
    return { error: `A ${wowClass} cannot fill the ${role} role.` };
  }
  if (professions.length > MAX_PROFESSIONS) {
    return { error: "Two professions maximum." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("characters").insert({
    member_id: member.id,
    name,
    surname: surname || null,
    class: wowClass,
    role,
    professions,
    planned,
  });

  if (error) {
    console.error("[addCharacter]", error);
    return { error: "Could not save that character. Try again." };
  }

  refresh();
  return { ok: true, savedAt: Date.now() };
}

export async function setMainCharacter(characterId: string) {
  const member = await getMember();
  if (!member) return;

  const supabase = await createClient();
  // The RPC clears the previous main and sets the new one in one transaction,
  // which the one-main-per-member index requires.
  const { error } = await supabase.rpc("set_main_character", {
    p_character_id: characterId,
  });

  if (error) console.error("[setMainCharacter]", error);
  refresh();
}

export async function deleteCharacter(characterId: string) {
  const member = await getMember();
  if (!member) return;

  const supabase = await createClient();
  const { error } = await supabase
    .from("characters")
    .delete()
    .eq("id", characterId)
    .eq("member_id", member.id);

  if (error) console.error("[deleteCharacter]", error);
  refresh();
}
