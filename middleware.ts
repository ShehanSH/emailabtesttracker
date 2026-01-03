import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getMiddlewareSession } from "@/lib/auth/middleware-auth";

export async function middleware(request: NextRequest) {
  const session = await getMiddlewareSession(request);

  // Protect dashboard and API routes
  if (!session?.user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/templates/:path*", "/api/templates/:path*"],
};

