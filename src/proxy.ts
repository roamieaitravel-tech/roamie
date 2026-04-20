import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Define protected routes
const PROTECTED_ROUTES = ["/dashboard", "/onboarding", "/plan", "/results", "/matches", "/trips", "/profile"];

export async function proxy(request: NextRequest) {
  // Update session to refresh auth tokens
  const { response, user } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  // Check if route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // If it's a protected route, check authentication
  if (isProtectedRoute) {
    // If no user session, redirect to login
    if (!user) {
      const loginUrl = new URL("/login", request.url);
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
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
