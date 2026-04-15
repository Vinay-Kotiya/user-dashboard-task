import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/jwt";
export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token?.authToken || !token?.authToken.startsWith("Bearer ")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const finalToken = token.authToken.split(" ")[1]; // ✅ FIX
  // console.log("Middleware data =========================>", finalToken);
  const { pathname } = request.nextUrl;
  if (!finalToken && pathname.startsWith("/")) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
  if (token.role != "ADMIN" && pathname.startsWith("/dashboard")) {
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }
  if (token.role == "ADMIN" && pathname.startsWith("/")) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/admin/:path*", "/"],
};
