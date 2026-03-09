import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// We export the named 'proxy' function as per Next.js 16 conventions
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Define our protected route prefixes
  const isAdminRoute = pathname.startsWith('/admin')
  const isTutorRoute = pathname.startsWith('/tutor')
  const isStudentRoute = pathname.startsWith('/dashboard')
  const isOnboardingRoute = pathname.startsWith('/onboarding')

  // If it's a public route (like /, /login, /register, /tutors), skip the proxy logic
  if (!isAdminRoute && !isTutorRoute && !isStudentRoute && !isOnboardingRoute) {
    return NextResponse.next()
  }

  // Grab the cookies from the incoming request to pass to our Better Auth backend
  const cookieHeader = request.headers.get('cookie') || ''

  try {
    // 1. Verify the session with the backend
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/get-session`, {
      headers: {
        cookie: cookieHeader,
      },
    })

    // 2. If the user is not logged in, boot them to the login page
    if (!res.ok) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // 3. Extract the user role from the session
    const sessionData = await res.json()
    const role = sessionData?.user?.role // "STUDENT", "TUTOR", or "ADMIN"

    // 4. Enforce strict Role-Based Access Control (RBAC)
    if (isAdminRoute && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard/bookings', request.url))
    }

    if (isTutorRoute && role !== 'TUTOR') {
      return NextResponse.redirect(new URL('/dashboard/bookings', request.url))
    }

    if (isStudentRoute && role !== 'STUDENT') {
      // If a Tutor tries to access the student dashboard, send them to their tutor portal
      if (role === 'TUTOR') return NextResponse.redirect(new URL('/tutor/dashboard', request.url))
      // If an Admin tries, send them to the admin portal
      if (role === 'ADMIN') return NextResponse.redirect(new URL('/admin', request.url))
    }

    // If they pass all checks, allow the request to proceed!
    return NextResponse.next()
    
  } catch (error) {
    // Failsafe: If the fetch crashes, redirect to login to be safe
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

// The matcher configuration filters the Proxy to only run on our protected paths
export const config = {
  matcher: [
    '/admin/:path*',
    '/tutor/:path*',
    '/dashboard/:path*',
    '/onboarding/:path*',
  ],
}