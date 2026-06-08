import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    const isAuthenticated = request.cookies.get("admin_auth")?.value === "1";

    if (!isAuthenticated) {
      const loginUrl = new URL("/admin-login", request.url);
      const target = `${pathname}${search}`;
      loginUrl.searchParams.set("next", target);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
