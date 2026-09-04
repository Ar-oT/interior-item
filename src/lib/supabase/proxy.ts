import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie);
  });
  from.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") return;
    to.headers.set(key, value);
  });
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value),
          );
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const isAuthenticated = Boolean(data?.claims);
  const path = request.nextUrl.pathname;
  const isPublicPath =
    path.startsWith("/login") ||
    path.startsWith("/auth") ||
    path.startsWith("/share") ||
    path.startsWith("/api/payments/webhook");

  if (!isAuthenticated && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    const redirectResponse = NextResponse.redirect(url);
    copyCookies(supabaseResponse, redirectResponse);
    return redirectResponse;
  }

  if (isAuthenticated && path.startsWith("/login")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    const redirectResponse = NextResponse.redirect(url);
    copyCookies(supabaseResponse, redirectResponse);
    return redirectResponse;
  }

  return supabaseResponse;
}
