import { headers } from "next/headers";
import { SITE_URL } from "./supabase/config";

/** Takes the first entry of a possibly comma-chained forwarded header. */
function firstHop(value: string | null): string | null {
  const first = value?.split(",")[0]?.trim();
  return first ? first : null;
}

/**
 * Hostinger terminates TLS in front of the Node process, so `request.url`
 * reports http and an internal host. The forwarded headers describe the public
 * origin, and OAuth redirects have to match it exactly.
 *
 * NEXT_PUBLIC_SITE_URL wins when set, because a forwarded header can be
 * spoofed by a client if the edge proxy passes it through, which would turn
 * the OAuth callback into an open redirect.
 */
export async function siteOrigin(): Promise<string> {
  if (SITE_URL) return SITE_URL.replace(/\/+$/, "");

  const h = await headers();
  const host =
    firstHop(h.get("x-forwarded-host")) ??
    firstHop(h.get("host")) ??
    "onslaughtsreckoning.com";
  const isLocal = host.startsWith("localhost") || host.startsWith("127.0.0.1");
  const proto =
    firstHop(h.get("x-forwarded-proto")) ?? (isLocal ? "http" : "https");

  return `${proto}://${host}`;
}
