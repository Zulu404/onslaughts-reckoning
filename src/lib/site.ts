import { headers } from "next/headers";

/**
 * Hostinger terminates TLS in front of the Node process, so `request.url`
 * reports http and an internal host. The forwarded headers are what actually
 * describe the public origin, and OAuth redirects have to match it exactly.
 */
export async function siteOrigin(): Promise<string> {
  const h = await headers();
  const host =
    h.get("x-forwarded-host") ?? h.get("host") ?? "onslaughtsreckoning.com";
  const proto =
    h.get("x-forwarded-proto") ??
    (host.startsWith("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https");
  return `${proto}://${host.split(",")[0].trim()}`;
}
