import { NextRequest, NextResponse } from "next/server";
import { userService } from "./services/user.service";
import { Roles } from "./constants/roles";

export const proxy = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;

  let isAuthenticated = false;
  let userRole = null;
const { data } = await userService.getSession();
  if (data && data.session) {
    isAuthenticated = true;
    userRole = (data.user as any).role || Roles.student;
  }

  if (isAuthenticated && (pathname === "/auth/login" || pathname === "/auth/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }


  const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/tutor-dashboard") || pathname.startsWith("/admin-dashboard");
  
  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // 4. Basic Role Protection (Optional but recommended)
  if (isAuthenticated && pathname.startsWith("/tutor-dashboard") && userRole !== Roles.tutor) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tutor-dashboard/:path*",
    "/admin-dashboard/:path*",
    "/auth/login",
    "/auth/register",
  ],
};