import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

/**
 * Handles email confirmation / OAuth PKCE `?code=` redirects.
 * Add this URL to Supabase → Authentication → URL configuration → Redirect URLs.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextRaw = searchParams.get("next") ?? "/scan";
  const nextPath = nextRaw.startsWith("/") ? nextRaw : `/${nextRaw}`;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${nextPath}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=callback`);
}
