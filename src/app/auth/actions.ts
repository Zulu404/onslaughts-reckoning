"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { authConfigured } from "@/lib/supabase/config";
import { siteOrigin } from "@/lib/site";

export async function signInWithDiscord() {
  if (!authConfigured) redirect("/join?error=unconfigured");

  const supabase = await createClient();
  const origin = await siteOrigin();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: { redirectTo: `${origin}/auth/callback` },
  });

  if (error || !data?.url) redirect("/join?error=signin");

  redirect(data.url);
}

export async function signOut() {
  if (authConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
