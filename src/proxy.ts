import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  authConfigured,
} from "@/lib/supabase/config";

/**
 * Next.js 16 renamed Middleware to Proxy. This refreshes the Supabase access
 * token on navigation so Server Components, which cannot write cookies, always
 * see a valid session. Without it a player gets signed out when their token
 * expires mid-visit.
 */
export async function proxy(request: NextRequest) {
  if (!authConfigured) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        // The response has to be rebuilt from the mutated request so the
        // refreshed cookies reach both the page render and the browser.
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  await supabase.auth.getUser();

  return response;
}

// Only the routes that actually read a session, rather than every request.
// "/" is included because the landing page now picks its primary call to
// action from the session: without a refresh here, a member whose token had
// expired would be shown "Log In" despite still being signed in.
export const config = {
  matcher: [
    "/",
    "/join/:path*",
    "/roster/:path*",
    "/auth/:path*",
  ],
};
