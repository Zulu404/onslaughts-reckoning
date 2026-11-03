"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getMember } from "@/lib/dal";

/**
 * The officer check also lives inside the set_member_status function, so this
 * early return is a convenience rather than the actual protection.
 */
export async function setStatus(
  memberId: string,
  status: "pending" | "accepted" | "rejected",
  formData?: FormData,
) {
  const me = await getMember();
  if (!me?.is_officer) return;

  // Always sent as a string, including empty, so clearing the box clears the
  // note. Passing null instead would make an existing note unremovable.
  const note = formData ? String(formData.get("note") ?? "").trim() : "";

  const supabase = await createClient();
  const { error } = await supabase.rpc("set_member_status", {
    p_member_id: memberId,
    p_status: status,
    p_note: note,
  });

  if (error) console.error("[setStatus]", error.message);

  revalidatePath("/officers");
  revalidatePath("/roster");
  revalidatePath("/join");
}
