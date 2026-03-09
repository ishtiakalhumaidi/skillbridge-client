import { cookies } from "next/headers"
import { TutorBookingsTable } from "./TutorBookingsTable"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

async function getMyBookings() {
  try {
    const cookieStore = await cookies();
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/my-bookings`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });
    
    if (!res.ok) return [];
    
    const responseData = await res.json();
    return responseData?.data || [];
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
}

// Helper to fetch the current user's session from Better Auth
async function getSession() {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/get-session`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
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

  // Calculate some quick stats for the dashboard header
  const tutorBookings = bookings.filter((b: any) => b.tutor?.userId === currentUserId);
  const totalSessions = tutorBookings.length;
  const completedSessions = tutorBookings.filter((b: any) => b.status === "COMPLETED").length;
  const upcomingSessions = tutorBookings.filter((b: any) => b.status === "CONFIRMED").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tutor Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Manage your upcoming sessions and track your teaching progress.
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 shadow-sm border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-primary">{totalSessions}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 shadow-sm border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-blue-500">{upcomingSessions}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 shadow-sm border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-green-500">{completedSessions}</div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Table */}
      <Card className="border-none shadow-sm bg-card/50">
        <CardHeader>
          <CardTitle>Session Management</CardTitle>
          <CardDescription>
            Update the status of your sessions here. Mark them as completed once the lesson is finished.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentUserId ? (
            <TutorBookingsTable initialBookings={bookings} currentUserId={currentUserId} />
          ) : (
            <div className="text-center py-10 text-muted-foreground border rounded-lg">
              Authentication error. Please log in again.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}