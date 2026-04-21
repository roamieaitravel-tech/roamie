import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Define public and protected routes
const PUBLIC_ROUTES = ["/", "/login", "/signup", "/onboarding", "/-p"];
const PROTECTED_ROUTES = ["/dashboard", "/plan", "/results", "/matches", "/trips", "/profile"];

export async function middleware(request: NextRequest) {
  // Update session to refresh auth tokens
  const response = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  // Check if route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // If it's a protected route, check authentication
  if (isProtectedRoute) {
    const authToken = request.cookies.get("sb-auth-token");

    // If no auth token, redirect to login using NEXT_PUBLIC_SITE_URL
    if (!authToken) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
      const loginUrl = new URL("/login", siteUrl);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
