"use client"

import { format } from "date-fns"
import { CalendarX2 } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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

export function AdminBookingsTable({ bookings }: { bookings: any[] }) {
  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg bg-background/50 border-dashed">
        <CalendarX2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium">No bookings found</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          There are currently no tutoring sessions booked on the platform.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-md border bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Session ID</TableHead>
            <TableHead>Tutor</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-mono text-xs text-muted-foreground">
                {booking.id.substring(0, 8)}...
              </TableCell>
              <TableCell>
                 <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={booking.tutor?.user?.image} />
                    <AvatarFallback className="font-mono text-[10px] bg-primary/10 text-primary">
                      {booking.tutor?.user?.name?.substring(0, 2).toUpperCase() || "TU"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm">{booking.tutor?.user?.name || "Unknown"}</span>
                </div>
              </TableCell>
              <TableCell>
                 <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={booking.student?.image} />
                    <AvatarFallback className="font-mono text-[10px] bg-primary/10 text-primary">
                      {booking.student?.name?.substring(0, 2).toUpperCase() || "ST"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm">{booking.student?.name || "Unknown"}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{format(new Date(booking.date), "MMM dd, yyyy")}</span>
                  <span className="text-xs text-muted-foreground">{booking.startTime} - {booking.endTime}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm">
                {booking.category?.name || "Subject"}
              </TableCell>
              <TableCell>
                <StatusBadge status={booking.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}