import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const ADMIN_PREFIX = "/admin";
const PUBLIC_ADMIN_PATHS = ["/admin/login"];

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith(ADMIN_PREFIX)) {
    const isPublic = PUBLIC_ADMIN_PATHS.some((p) => pathname === p);
    if (!isPublic) {
      const session = await auth();
      if (!session?.user) {
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  if (pathname.startsWith("/dashboard")) {
    const adminUrl = new URL(pathname.replace("/dashboard", "/admin"), request.url);
    adminUrl.search = search;
    return NextResponse.redirect(adminUrl);
  }

  if (pathname === "/admin-login") {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.search = search;
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/dashboard/:path*", "/admin-login"],
};
