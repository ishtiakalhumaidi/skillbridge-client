"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Loader2, CheckCircle, XCircle, MoreHorizontal } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { bookingsApi } from "@/lib/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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

export function TutorBookingsTable({ initialBookings, currentUserId }: { initialBookings: any[], currentUserId: string }) {
  // Filter bookings to only show ones where the logged-in user is the tutor
  const tutorBookings = initialBookings.filter(b => b.tutor?.userId === currentUserId)
  
  const [bookings, setBookings] = useState(tutorBookings)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      setLoadingId(bookingId)
      await bookingsApi.updateStatus(bookingId, newStatus)
      
      // Update local state instantly
      setBookings(bookings.map(b => 
        b.id === bookingId ? { ...b, status: newStatus } : b
      ))
    } catch (error) {
      console.error("Failed to update booking status", error)
      alert("Failed to update booking status. Please try again.")
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="rounded-md border bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={booking.student?.image} />
                    <AvatarFallback className="font-mono text-xs bg-primary/10 text-primary">
                      {booking.student?.name?.substring(0, 2).toUpperCase() || "ST"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{booking.student?.name || "Student"}</span>
                    <span className="text-xs text-muted-foreground">{booking.student?.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{format(new Date(booking.date), "MMM dd, yyyy")}</span>
                  <span className="text-sm text-muted-foreground">{booking.startTime} - {booking.endTime}</span>
                </div>
              </TableCell>
              <TableCell>
                {booking.category?.name || "Subject"}
              </TableCell>
              <TableCell>
                <StatusBadge status={booking.status} />
              </TableCell>
              <TableCell className="text-right">
                {/* Only show actions if the booking is currently CONFIRMED */}
                {booking.status === "CONFIRMED" ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 w-8 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                      {loadingId === booking.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <MoreHorizontal className="h-4 w-4" />
                      )}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Manage Session</DropdownMenuLabel>
                      <DropdownMenuItem 
                        onClick={() => handleStatusUpdate(booking.id, "COMPLETED")}
                        className="text-green-600 focus:text-green-600 cursor-pointer"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" /> Mark as Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleStatusUpdate(booking.id, "CANCELLED")}
                        className="text-destructive focus:text-destructive cursor-pointer"
                      >
                        <XCircle className="mr-2 h-4 w-4" /> Cancel Booking
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <span className="text-xs text-muted-foreground italic">No actions available</span>
                )}
              </TableCell>
            </TableRow>
          ))}
          {bookings.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                You have no tutoring sessions yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}