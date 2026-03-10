import { NextRequest, NextResponse } from "next/server";
import { userService } from "./service/user.service";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/verify-email") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register")
  ) {
    return NextResponse.next();
  }
  try {
    const sessionData = await userService.getSession();
    const user = sessionData?.data?.user;

   
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const role = user.role;

    // Admin protection
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Tutor protection
    if (pathname.startsWith("/tutor") && role !== "TUTOR") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/tutor/:path*",
    "/dashboard/:path*",
  ],
};