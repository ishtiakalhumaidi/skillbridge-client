/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { format } from "date-fns"
import { CalendarX2 } from "lucide-react"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "CONFIRMED":
      return <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-[10px] font-bold text-blue-500 uppercase tracking-widest border border-blue-500/20">Confirmed</span>;
    case "COMPLETED":
      return <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary uppercase tracking-widest border border-primary/20">Completed</span>;
    case "CANCELLED":
      return <span className="inline-flex items-center rounded-full bg-destructive/10 px-3 py-1 text-[10px] font-bold text-destructive uppercase tracking-widest border border-destructive/20">Cancelled</span>;
    case "PENDING":
      return <span className="inline-flex items-center rounded-full bg-purple-500/10 px-3 py-1 text-[10px] font-bold text-purple-500 uppercase tracking-widest border border-purple-500/20">Pending</span>;
    default:
      return <span className="inline-flex items-center rounded-full bg-foreground/10 px-3 py-1 text-[10px] font-bold text-foreground/60 uppercase tracking-widest border border-foreground/10">{status}</span>;
  }
}

export function AdminBookingsTable({ bookings }: { bookings: any[] }) {
  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center border border-foreground/10 rounded-3xl bg-background shadow-sm">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-foreground/5 mb-6">
          <CalendarX2 className="h-10 w-10 text-foreground/20" />
        </div>
        <h3 className="text-2xl font-head tracking-tighter text-foreground mb-2">No bookings found</h3>
        <p className="text-base text-foreground/60 max-w-sm font-medium">
          There are currently no tutoring sessions booked on the platform.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-foreground/10 bg-background shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-foreground/5 border-b border-foreground/10">
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-xs font-bold tracking-widest text-foreground/50 uppercase py-5 pl-6">ID</TableHead>
            <TableHead className="text-xs font-bold tracking-widest text-foreground/50 uppercase py-5">Tutor</TableHead>
            <TableHead className="text-xs font-bold tracking-widest text-foreground/50 uppercase py-5">Student</TableHead>
            <TableHead className="text-xs font-bold tracking-widest text-foreground/50 uppercase py-5">Date & Time</TableHead>
            <TableHead className="text-xs font-bold tracking-widest text-foreground/50 uppercase py-5">Subject</TableHead>
            <TableHead className="text-right text-xs font-bold tracking-widest text-foreground/50 uppercase py-5 pr-6">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id} className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors">
              <TableCell className="py-4 pl-6 font-mono text-xs text-foreground/40 font-bold uppercase tracking-widest">
                {booking.id.substring(0, 6)}
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full border border-foreground/10 bg-foreground/5 flex items-center justify-center font-bold text-[10px] text-foreground shrink-0 overflow-hidden">
                    {booking.tutor?.user?.image ? (
                      <img src={booking.tutor.user.image} alt={booking.tutor.user.name} className="w-full h-full object-cover" />
                    ) : (
                      booking.tutor?.user?.name?.substring(0, 2).toUpperCase() || "TU"
                    )}
                  </div>
                  <span className="font-bold text-sm text-foreground">{booking.tutor?.user?.name || "Unknown"}</span>
                </div>
              </TableCell>
              <TableCell className="py-4">
                 <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full border border-foreground/10 bg-foreground/5 flex items-center justify-center font-bold text-[10px] text-foreground shrink-0 overflow-hidden">
                    {booking.student?.image ? (
                      <img src={booking.student.image} alt={booking.student.name} className="w-full h-full object-cover" />
                    ) : (
                      booking.student?.name?.substring(0, 2).toUpperCase() || "ST"
                    )}
                  </div>
                  <span className="font-bold text-sm text-foreground">{booking.student?.name || "Unknown"}</span>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-foreground">{format(new Date(booking.date), "MMM dd, yyyy")}</span>
                  <span className="text-xs font-semibold text-foreground/50 mt-0.5">{booking.startTime} - {booking.endTime}</span>
                </div>
              </TableCell>
              <TableCell className="py-4 text-sm font-semibold text-foreground/70">
                {booking.category?.name || "Subject"}
              </TableCell>
              <TableCell className="text-right py-4 pr-6">
                <StatusBadge status={booking.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}