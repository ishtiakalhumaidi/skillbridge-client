import { NextRequest, NextResponse } from "next/server";

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
    const cookieHeader = request.headers.get("cookie") || "";
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/get-session`,
      {
        headers: { Cookie: cookieHeader },
        cache: "no-store",
      },
    );

    if (!res.ok) throw new Error("Session fetch failed");

    const sessionData = await res.json();
    const user = sessionData?.user;

    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = user.role;

    // 👉 FIX: Strict Regex match. This ONLY blocks "/tutors/[id]/book"
    if (pathname.match(/^\/tutors\/[^/]+\/book$/)) {
      if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      if (role === "TUTOR") {
        return NextResponse.redirect(new URL("/tutor/dashboard", request.url));
      }
    }

    // Admin protection
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/student/dashboard/bookings", request.url));
    }

    // Tutor protection
    if (pathname.startsWith("/tutor/") && role !== "TUTOR") {
      return NextResponse.redirect(new URL("/student/dashboard/bookings", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/tutor/:path*",
    "/student/:path*",
    "/dashboard/:path*",
    "/tutors/:path*/book", 
  ],
};