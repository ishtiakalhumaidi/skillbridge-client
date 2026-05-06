/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Loader2, CheckCircle, XCircle, MoreHorizontal, LinkIcon, Video } from "lucide-react"
import { toast } from "sonner"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuTrigger, DropdownMenuGroup, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { bookingsApi } from "@/lib/api"

function StatusBadge({ status, paymentStatus }: { status: string, paymentStatus: string }) {
  if (status === "CONFIRMED" && paymentStatus === "UNPAID") {
    return <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-bold text-amber-500 uppercase tracking-widest border border-amber-500/20">Awaiting Student Pay</span>;
  }
  if (status === "CONFIRMED" && paymentStatus === "PAID") {
    return <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-[10px] font-bold text-blue-500 uppercase tracking-widest border border-blue-500/20">Ready to Teach</span>;
  }
  switch (status) {
    case "PENDING":
      return <span className="inline-flex items-center rounded-full bg-purple-500/10 px-3 py-1 text-[10px] font-bold text-purple-500 uppercase tracking-widest border border-purple-500/20">Action Required</span>;
    case "COMPLETED":
      return <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary uppercase tracking-widest border border-primary/20">Completed</span>;
    case "CANCELLED":
      return <span className="inline-flex items-center rounded-full bg-destructive/10 px-3 py-1 text-[10px] font-bold text-destructive uppercase tracking-widest border border-destructive/20">Cancelled</span>;
    default:
      return <span className="inline-flex items-center rounded-full bg-foreground/10 px-3 py-1 text-[10px] font-bold text-foreground/60 uppercase tracking-widest border border-foreground/10">{status}</span>;
  }
}

export function TutorBookingsTable({ initialBookings, currentUserId }: { initialBookings: any[], currentUserId: string }) {
  const tutorBookings = initialBookings.filter(b => b.tutor?.userId === currentUserId)
  const [bookings, setBookings] = useState(tutorBookings)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  
  // Link Modal State
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
  const [activeBookingId, setActiveBookingId] = useState("")
  const [meetingLink, setMeetingLink] = useState("")
  const [isSubmittingLink, setIsSubmittingLink] = useState(false)

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      setLoadingId(bookingId)
      await bookingsApi.updateStatus(bookingId, newStatus)
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b))
      toast.success(`Session marked as ${newStatus.toLowerCase()}`)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update booking status.")
    } finally {
      setLoadingId(null)
    }
  }

  const handleSaveMeetingLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!meetingLink.trim()) return toast.error("Please enter a valid link.")
    
    try {
      setIsSubmittingLink(true)
      await bookingsApi.updateMeetingLink(activeBookingId, meetingLink)
      setBookings(bookings.map(b => b.id === activeBookingId ? { ...b, meetingLink } : b))
      toast.success("Meeting link shared with student!")
      setIsLinkModalOpen(false)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save link.")
    } finally {
      setIsSubmittingLink(false)
    }
  }

  return (
    <div className="rounded-3xl border border-foreground/10 bg-background shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Meeting Link Modal */}
      <Dialog open={isLinkModalOpen} onOpenChange={setIsLinkModalOpen}>
        <DialogContent className="border border-foreground/10 rounded-3xl shadow-2xl bg-background sm:max-w-md p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-head tracking-tighter text-foreground">Share Meeting Link</DialogTitle>
            <DialogDescription className="text-sm font-medium text-foreground/60 mt-1">
              Paste your Google Meet, Zoom, or Teams link here. The student will see it in their dashboard.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveMeetingLink} className="space-y-6">
            <div className="space-y-3">
              <label className="block font-bold text-xs uppercase tracking-widest text-foreground/70">Meeting URL</label>
              <input
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="https://meet.google.com/xyz-abc"
                className="w-full rounded-2xl border border-foreground/20 bg-transparent px-5 py-4 text-base font-semibold text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/20 hover:border-foreground/40"
              />
            </div>
            <div className="flex justify-end gap-4 pt-2">
              <button type="button" onClick={() => setIsLinkModalOpen(false)} className="rounded-full px-6 py-3 text-sm font-bold text-foreground/60 transition-colors hover:bg-foreground/5 hover:text-foreground">
                Cancel
              </button>
              <button type="submit" disabled={isSubmittingLink} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-8 text-sm font-bold text-background transition-all hover:scale-105 active:scale-95 disabled:opacity-30 hover:bg-primary hover:text-primary-foreground shadow-md">
                {isSubmittingLink && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Share Link
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader className="bg-foreground/5 border-b border-foreground/10">
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-xs font-bold tracking-widest text-foreground/50 uppercase py-5">Student</TableHead>
            <TableHead className="text-xs font-bold tracking-widest text-foreground/50 uppercase py-5">Date & Time</TableHead>
            <TableHead className="text-xs font-bold tracking-widest text-foreground/50 uppercase py-5">Subject</TableHead>
            <TableHead className="text-xs font-bold tracking-widest text-foreground/50 uppercase py-5">Status</TableHead>
            <TableHead className="text-right text-xs font-bold tracking-widest text-foreground/50 uppercase py-5">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id} className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors">
              <TableCell className="py-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10 text-foreground font-bold text-xs shrink-0">
                    {booking.student?.name?.substring(0, 2).toUpperCase() || "ST"}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-foreground">{booking.student?.name || "Student"}</span>
                    <span className="text-xs font-semibold text-foreground/50">{booking.student?.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-foreground">{format(new Date(booking.date), "MMM dd, yyyy")}</span>
                  <span className="text-xs font-semibold text-foreground/50 mt-0.5">
                    {booking.startTime} - {booking.endTime}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-sm font-semibold text-foreground/70 py-4">
                {booking.category?.name || "Subject"}
              </TableCell>
              <TableCell className="py-4">
                <StatusBadge status={booking.status} paymentStatus={booking.paymentStatus} />
                {booking.meetingLink && booking.status === "CONFIRMED" && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-widest">
                    <LinkIcon className="h-3 w-3" /> Link Shared
                  </div>
                )}
              </TableCell>
              <TableCell className="text-right py-4">
                
                {booking.status === "PENDING" ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-foreground/50 hover:bg-foreground/10 hover:text-foreground transition-colors focus:outline-none">
                      {loadingId === booking.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-2xl border border-foreground/10 bg-background p-2 shadow-xl">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">Request</DropdownMenuLabel>
                        <DropdownMenuSeparator className="my-1 bg-foreground/10" />
                        <DropdownMenuItem onClick={() => handleStatusUpdate(booking.id, "CONFIRMED")} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-primary transition-colors focus:bg-primary/10 cursor-pointer">
                          <CheckCircle className="h-4 w-4" /> Accept Session
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(booking.id, "CANCELLED")} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-destructive transition-colors focus:bg-destructive/10 cursor-pointer">
                          <XCircle className="h-4 w-4" /> Decline
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>

                ) : booking.status === "CONFIRMED" && booking.paymentStatus === "PAID" ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-foreground/50 hover:bg-foreground/10 hover:text-foreground transition-colors focus:outline-none">
                      {loadingId === booking.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-2xl border border-foreground/10 bg-background p-2 shadow-xl">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator className="my-1 bg-foreground/10" />
                        
                        <DropdownMenuItem 
                          onClick={() => {
                            setActiveBookingId(booking.id);
                            setMeetingLink(booking.meetingLink || "");
                            setIsLinkModalOpen(true);
                          }} 
                          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-foreground transition-colors focus:bg-foreground/5 cursor-pointer"
                        >
                          <Video className="h-4 w-4" /> {booking.meetingLink ? "Edit Meeting Link" : "Add Meeting Link"}
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator className="my-1 bg-foreground/10" />
                        
                        <DropdownMenuItem onClick={() => handleStatusUpdate(booking.id, "COMPLETED")} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-emerald-500 transition-colors focus:bg-emerald-500/10 cursor-pointer">
                          <CheckCircle className="h-4 w-4" /> Mark Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(booking.id, "CANCELLED")} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-destructive transition-colors focus:bg-destructive/10 cursor-pointer">
                          <XCircle className="h-4 w-4" /> Cancel Booking
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>

                ) : (
                  <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Locked</span>
                )}

              </TableCell>
            </TableRow>
          ))}
          {bookings.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="py-16 text-center text-sm font-medium text-foreground/50">
                You have no tutoring sessions yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}