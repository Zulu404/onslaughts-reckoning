import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authConfigured } from "@/lib/supabase/config";
import { siteOrigin } from "@/lib/site";

/**
 * Discord sends the player back here with a one-time code. We trade it for a
 * session, then make sure a `members` row exists before handing them to /join.
 */
export async function GET(request: Request) {
  const origin = await siteOrigin();
  const code = new URL(request.url).searchParams.get("code");

  if (!authConfigured) {
    return NextResponse.redirect(`${origin}/join?error=unconfigured`);
  }
  if (!code) {
    return NextResponse.redirect(`${origin}/join?error=callback`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/join?error=exchange`);
  }

  const meta = data.user.user_metadata ?? {};
  const discordId = (meta.provider_id ?? meta.sub ?? "") as string;

  if (discordId) {
    // global_name is Discord's current display name; full_name/name are the
    // older fields, kept as fallbacks for accounts that predate the change.
    const username = (meta.custom_claims?.global_name ??
      meta.full_name ??
      meta.name ??
      null) as string | null;

    const { error: upsertError } = await supabase.from("members").upsert(
      {
        user_id: data.user.id,
        discord_id: discordId,
        discord_username: username,
        discord_avatar: (meta.avatar_url ?? meta.picture ?? null) as
          | string
          | null,
        last_seen_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );

    if (upsertError) {
      console.error("[auth/callback] member upsert failed", upsertError);
      return NextResponse.redirect(`${origin}/join?error=profile`);
    }
  }

  return NextResponse.redirect(`${origin}/join`);
}
