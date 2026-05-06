/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers"
import { TutorBookingsTable } from "./TutorBookingsTable"
import { authClient } from "@/lib/auth-client"

async function getMyBookings() {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/my-bookings`, {
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    });
    
    if (!res.ok) return [];
    const responseData = await res.json();
    return responseData?.data?.bookings || responseData?.data || [];
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
}

async function getSession() {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/get-session`, {
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

export default async function TutorDashboardPage() {
  const bookings = await getMyBookings();
  const session = await getSession();
  
  const currentUserId = session?.user?.id;
  const tutorBookings = Array.isArray(bookings) ? bookings.filter((b: any) => b.tutor?.userId === currentUserId) : [];
  
  const totalSessions = tutorBookings.length;
  const completedSessions = tutorBookings.filter((b: any) => b.status === "COMPLETED").length;
  const upcomingSessions = tutorBookings.filter((b: any) => b.status === "CONFIRMED").length;

  return (
    <div className="space-y-12 w-full max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="space-y-2 border-b border-foreground/10 pb-6">
        <h1 className="text-4xl font-head tracking-tighter text-foreground">Command Center.</h1>
        <p className="text-lg font-medium text-foreground/60">
          Manage your upcoming sessions and track your tutoring metrics.
        </p>
      </div>

      {/* Premium Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative overflow-hidden rounded-3xl border border-foreground/10 bg-background p-8 shadow-sm transition-all hover:border-foreground/20 hover:shadow-md">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-primary/10 blur-2xl"></div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/50 mb-2">Total Bookings</h3>
          <div className="mt-4 text-5xl font-head tracking-tight text-foreground">{totalSessions}</div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-foreground/10 bg-background p-8 shadow-sm transition-all hover:border-foreground/20 hover:shadow-md">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-primary/10 blur-2xl" style={{ animationDelay: "1s" }}></div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/50 mb-2">Upcoming</h3>
          <div className="mt-4 text-5xl font-head tracking-tight text-primary">{upcomingSessions}</div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-foreground/10 bg-background p-8 shadow-sm transition-all hover:border-foreground/20 hover:shadow-md">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-foreground/5 blur-2xl" style={{ animationDelay: "2s" }}></div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/50 mb-2">Completed</h3>
          <div className="mt-4 text-5xl font-head tracking-tight text-foreground">{completedSessions}</div>
        </div>
      </div>

      {/* Bookings Table Wrapper */}
      <div className="pt-6">
        <div className="mb-8">
          <h2 className="text-3xl font-head tracking-tighter text-foreground mb-2">Session Management.</h2>
          <p className="text-base font-medium text-foreground/60">Update the status of your sessions. Mark them as completed once finished.</p>
        </div>
        
        {currentUserId ? (
          <TutorBookingsTable initialBookings={tutorBookings} currentUserId={currentUserId} />
        ) : (
          <div className="rounded-3xl border border-destructive/20 bg-destructive/10 p-8 text-center text-destructive font-bold">
            Authentication error. Please log in again.
          </div>
        )}
      </div>
    </div>
  )
}