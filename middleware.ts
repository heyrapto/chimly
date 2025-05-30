import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get token from Authorization header or cookie
  const authHeader = request.headers.get("authorization");
  const token =
    authHeader?.split(" ")[1] || request.cookies.get("token")?.value;

  // For dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Set token in response headers
  const response = NextResponse.next();
  if (token) {
    response.headers.set("Authorization", `Bearer ${token}`);
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
