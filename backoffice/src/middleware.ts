import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME, parseCredentialsEdge, verifySessionTokenEdge } from "@/lib/auth-edge";

const PUBLIC_PATHS = ["/login", "/api/organizer-applications"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if ((await verifySessionTokenEdge(token)) && pathname === "/login") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  const credentials = parseCredentialsEdge();
  if (!credentials) return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (await verifySessionTokenEdge(token)) return NextResponse.next();

  const loginUrl = new URL("/login", req.url);
  if (pathname !== "/") loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
