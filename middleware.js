import { NextResponse } from "next/server";

const MAINTENANCE_MODE = false;

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (!MAINTENANCE_MODE) {
    return NextResponse.next();
  }

  if (
    pathname === "/maintenance" ||
    pathname === "/api/status" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/icons") ||
    pathname === "/sw.js" ||
    pathname === "/pwa-sw.js" ||
    pathname === "/manifest.json" ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/maintenance";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
