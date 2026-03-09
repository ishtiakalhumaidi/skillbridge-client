import { cookies } from "next/headers"
import { format } from "date-fns"
import { CalendarX2 } from "lucide-react"
import { ReviewDialog } from "./ReviewDialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Fetch the authenticated user's bookings
async function getMyBookings() {
  try {
    const cookieStore = await cookies(); // Await the cookies function in Next 15+
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/my-bookings`, {
      headers: {
        // Pass the authentication cookies to the Better Auth backend
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

// Helper to color-code the statuses
function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "CONFIRMED":
      return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">Confirmed</Badge>;
    case "COMPLETED":
      return <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Completed</Badge>;
    case "CANCELLED":
      return <Badge variant="destructive">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default async function BookingsPage() {
  const bookings = await getMyBookings();

  return (
    <Card className="border-none shadow-sm bg-card/50">
      <CardHeader>
        <CardTitle className="text-2xl">My Bookings</CardTitle>
        <CardDescription>View and manage your tutoring sessions.</CardDescription>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg bg-background/50 border-dashed">
            <CalendarX2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">No bookings found</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              You haven't booked any tutoring sessions yet. Head over to the tutors page to find an expert.
            </p>
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Tutor</TableHead>
                <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead> 
            </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking: any) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      {format(new Date(booking.date), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      {booking.startTime} - {booking.endTime}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{booking.tutor?.user?.name || "Unknown Tutor"}</span>
                      </div>
                    </TableCell>
                  <TableCell>
                  <StatusBadge status={booking.status} />
                </TableCell>
                {/* NEW CELL: Only show button if status is COMPLETED */}
                <TableCell className="text-right">
                  {booking.status === "COMPLETED" && (
                    <ReviewDialog 
                      bookingId={booking.id} 
                      tutorName={booking.tutor?.user?.name || "Tutor"} 
                    />
                  )}
                </TableCell>
              </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}