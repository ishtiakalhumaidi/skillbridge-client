/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect } from "react";
import { format, startOfDay, isBefore } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import {
  Loader2, CheckCircle, XCircle, MoreHorizontal,
  LinkIcon, Video, CalendarX2, ArrowRight, AlertCircle, FilterX
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuTrigger, DropdownMenuGroup, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { bookingsApi } from "@/lib/api";
import { LocalTime } from "@/components/shared/LocalTime";

const inputClass =
  "w-full rounded-2xl border border-foreground/20 bg-transparent px-5 py-4 text-base font-semibold text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/20 hover:border-foreground/40";

function avatarPalette(name = "") {
  const p = [
    { bg: "#EFF6FF", color: "#1D4ED8" },
    { bg: "#F0FDFA", color: "#0F766E" },
    { bg: "#F5F3FF", color: "#6D28D9" },
    { bg: "#FFF7ED", color: "#C2410C" },
    { bg: "#F0FDF4", color: "#15803D" },
  ];
  return p[(name.charCodeAt(0) || 0) % p.length];
}

function getStatusConfig(status: string, paymentStatus: string, isOverdue: boolean) {
  if (isOverdue)
    return { label: "Action Overdue", bg: "bg-destructive/[0.1]", text: "text-destructive", border: "border-destructive/30", dot: "bg-destructive" };

  if (status === "CONFIRMED" && paymentStatus === "UNPAID")
    return { label: "Awaiting Payment", bg: "bg-amber-500/[0.08]", text: "text-amber-600", border: "border-amber-500/20", dot: "bg-amber-500" };
  if (status === "CONFIRMED" && paymentStatus === "PAID")
    return { label: "Ready to Teach", bg: "bg-blue-500/[0.08]", text: "text-blue-600", border: "border-blue-500/20", dot: "bg-blue-500" };

  switch (status) {
    case "PENDING":
      return { label: "Action Required", bg: "bg-violet-500/[0.08]", text: "text-violet-600", border: "border-violet-500/20", dot: "bg-violet-500" };
    case "COMPLETED":
      return { label: "Completed", bg: "bg-primary/[0.08]", text: "text-primary", border: "border-primary/20", dot: "bg-primary" };
    case "CANCELLED":
      return { label: "Cancelled", bg: "bg-destructive/[0.08]", text: "text-destructive", border: "border-destructive/20", dot: "bg-destructive" };
    default:
      return { label: status, bg: "bg-foreground/[0.06]", text: "text-foreground/50", border: "border-foreground/10", dot: "bg-foreground/40" };
  }
}

function StatusBadge({ status, paymentStatus, isOverdue }: { status: string; paymentStatus: string; isOverdue: boolean }) {
  const cfg = getStatusConfig(status, paymentStatus, isOverdue);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      {isOverdue ? <AlertCircle className="h-3 w-3 shrink-0" /> : <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${cfg.dot}`} />}
      {cfg.label}
    </span>
  );
}

export function TutorBookingsTable({ initialBookings, currentUserId }: { initialBookings: any[]; currentUserId: string }) {
  const [mounted, setMounted] = useState(false);
  const [bookings, setBookings] = useState(initialBookings.filter((b) => b.tutor?.userId === currentUserId));
  const [loadingId, setLoadingId] = useState<string | null>(null);
  
  // 👉 Advanced Filter States
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "UPCOMING" | "PAST">("ALL");
  const [dateFilter, setDateFilter] = useState("");

  // Modal State
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [activeBookingId, setActiveBookingId] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [isSubmittingLink, setIsSubmittingLink] = useState(false);

  useEffect(() => setMounted(true), []);

  // 1. Core Sorting (Priority -> Date)
  const sortedBookings = useMemo(() => {
    const today = startOfDay(new Date());

    return [...bookings].sort((a, b) => {
      const getPriority = (booking: any) => {
        if (booking.status === "COMPLETED" || booking.status === "CANCELLED") return 3; 
        if (isBefore(new Date(booking.date), today)) return 2; 
        return 1; 
      };

      const pA = getPriority(a);
      const pB = getPriority(b);
      if (pA !== pB) return pA - pB; 

      const timeA = new Date(a.date).getTime() + (new Date(a.startTime).getTime() % 86400000);
      const timeB = new Date(b.date).getTime() + (new Date(b.startTime).getTime() % 86400000);

      if (pA === 1) return timeA - timeB; 
      return timeB - timeA; 
    });
  }, [bookings]);

  // 👉 2. Filtering Logic applied on top of Sorted array
  const filteredBookings = useMemo(() => {
    const today = startOfDay(new Date());

    return sortedBookings.filter((booking) => {
      const isOverdue = isBefore(new Date(booking.date), today) && booking.status !== "COMPLETED" && booking.status !== "CANCELLED";
      
      // Check Status
      let matchesStatus = true;
      if (statusFilter === "PENDING") {
        matchesStatus = booking.status === "PENDING" && !isOverdue;
      } else if (statusFilter === "UPCOMING") {
        matchesStatus = booking.status === "CONFIRMED" && !isOverdue;
      } else if (statusFilter === "PAST") {
        matchesStatus = booking.status === "COMPLETED" || booking.status === "CANCELLED" || isOverdue;
      }

      // Check Date
      let matchesDate = true;
      if (dateFilter) {
        const formattedBookingDate = format(new Date(booking.date), "yyyy-MM-dd");
        matchesDate = formattedBookingDate === dateFilter;
      }

      return matchesStatus && matchesDate;
    });
  }, [sortedBookings, statusFilter, dateFilter]);

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      setLoadingId(bookingId);
      await bookingsApi.updateStatus(bookingId, newStatus);
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b)));
      toast.success(`Session marked as ${newStatus.toLowerCase()}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update status.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleSaveMeetingLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingLink.trim()) return toast.error("Please enter a valid link.");
    try {
      setIsSubmittingLink(true);
      await bookingsApi.updateMeetingLink(activeBookingId, meetingLink);
      setBookings((prev) => prev.map((b) => (b.id === activeBookingId ? { ...b, meetingLink } : b)));
      toast.success("Meeting link shared with student!");
      setIsLinkModalOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save link.");
    } finally {
      setIsSubmittingLink(false);
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border border-foreground/10 bg-background shadow-sm">
        <CalendarX2 className="h-10 w-10 text-foreground/30 mb-4" />
        <p className="text-2xl font-head tracking-tighter text-foreground mb-1">No sessions yet</p>
        <p className="text-sm font-medium text-foreground/50 max-w-xs">Once students book with you, they&apos;ll appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* 👉 The Premium Command & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 bg-background rounded-2xl border border-foreground/10 shadow-sm">
        
        {/* Segmented Status Control */}
        <div className="flex items-center w-full sm:w-auto bg-foreground/[0.03] p-1.5 rounded-xl border border-foreground/[0.05]">
          {(["ALL", "PENDING", "UPCOMING", "PAST"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`flex-1 sm:flex-none px-4 py-2 text-[11px] font-bold tracking-widest uppercase rounded-lg transition-all duration-300 ${
                statusFilter === filter
                  ? "bg-background text-primary shadow-sm border border-foreground/5"
                  : "text-foreground/40 hover:text-foreground/80 hover:bg-foreground/[0.02] border border-transparent"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Date Picker & Clear Button */}
        <div className="flex items-center gap-2 w-full sm:w-auto px-2 sm:px-0">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full sm:w-auto bg-transparent border border-foreground/10 rounded-xl px-4 py-2 text-sm font-medium text-foreground/70 focus:outline-none focus:border-primary transition-colors"
          />
          {dateFilter && (
            <button 
              onClick={() => setDateFilter("")}
              className="p-2.5 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
              title="Clear Date"
            >
              <FilterX className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <Dialog open={isLinkModalOpen} onOpenChange={setIsLinkModalOpen}>
        <DialogContent className="border border-foreground/10 rounded-3xl shadow-2xl bg-background sm:max-w-md p-8">
          <DialogHeader className="mb-6 text-left">
            <DialogTitle className="text-2xl font-head tracking-tighter text-foreground">Share Meeting Link</DialogTitle>
            <DialogDescription className="text-sm font-medium text-foreground/60 mt-1">
              Paste your Google Meet, Zoom, or Teams link. The student will see it in their dashboard.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveMeetingLink} className="space-y-6">
            <div className="space-y-3">
              <label className="block font-bold text-xs uppercase tracking-widest text-foreground/70">Meeting URL</label>
              <input value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} placeholder="https://meet.google.com/xyz-abc" className={inputClass} />
            </div>
            <div className="flex justify-end gap-4 pt-2">
              <button type="button" onClick={() => setIsLinkModalOpen(false)} className="rounded-full px-6 py-3 text-sm font-bold text-foreground/60 transition-colors hover:bg-foreground/5 hover:text-foreground">
                Cancel
              </button>
              <button type="submit" disabled={isSubmittingLink} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-8 text-sm font-bold text-background transition-all hover:scale-105 active:scale-95 disabled:opacity-30 hover:bg-primary hover:text-primary-foreground shadow-md">
                {isSubmittingLink ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <><Video className="h-4 w-4" /> Share Link</>}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 👉 Render Filtered Data */}
      <div className="flex flex-col gap-3">
        {filteredBookings.length === 0 ? (
          <div className="py-16 text-center rounded-3xl border border-dashed border-foreground/10 bg-foreground/[0.02]">
            <p className="text-sm font-medium text-foreground/50">No sessions match your filters.</p>
          </div>
        ) : (
          filteredBookings.map((booking) => {
            const studentName = booking.student?.name || "Student";
            const palette = avatarPalette(studentName);
            const isLoading = loadingId === booking.id;
            const today = startOfDay(new Date());
            const isOverdue = isBefore(new Date(booking.date), today) && booking.status !== "COMPLETED" && booking.status !== "CANCELLED";

            return (
              <div key={booking.id} className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border bg-background p-6 transition-all duration-300 hover:shadow-md ${isOverdue ? "border-destructive/40 bg-destructive/[0.02]" : "border-foreground/10 hover:border-primary"}`}>
                <div className="flex items-center gap-5 min-w-0 flex-1">
                  {booking.student?.image ? (
                    <img src={booking.student.image} alt={studentName} className="h-14 w-14 rounded-full overflow-hidden shrink-0 border border-foreground/10" />
                  ) : (
                    <div className="h-14 w-14 rounded-full overflow-hidden shrink-0 flex items-center justify-center font-head text-lg text-foreground/50 border border-foreground/10 bg-foreground/5">
                      {studentName.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <span className={`text-lg font-bold truncate ${isOverdue ? "text-destructive" : "text-foreground"}`}>{studentName}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-xs font-bold uppercase tracking-widest text-foreground/50">{booking.category?.name || "Subject"}</span>
                      <span className="text-foreground/20 text-xs hidden sm:block">•</span>
                      
                      <span className="text-sm font-semibold text-foreground/50">
                        {format(new Date(booking.date), "MMM dd, yyyy")} {" · "} 
                        {mounted ? <LocalTime dateStr={booking.startTime} /> : "..."} – 
                        {mounted ? <LocalTime dateStr={booking.endTime} /> : "..."}
                      </span>
                    </div>
                    {booking.meetingLink && booking.status === "CONFIRMED" && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <LinkIcon className="h-3.5 w-3.5 text-primary" />
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Link shared</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 pt-4 sm:pt-0 border-t border-foreground/10 sm:border-0 shrink-0">
                  <StatusBadge status={booking.status} paymentStatus={booking.paymentStatus} isOverdue={isOverdue} />

                  {booking.status === "PENDING" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-transparent text-foreground/50 hover:bg-foreground/10 hover:text-foreground transition-colors focus:outline-none">
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-5 w-5" />}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-2xl border border-foreground/10 bg-background p-2 shadow-xl">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">Request</DropdownMenuLabel>
                          <DropdownMenuSeparator className="my-1 bg-foreground/10" />
                          <DropdownMenuItem onSelect={() => handleStatusUpdate(booking.id, "CONFIRMED")} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-primary transition-colors focus:bg-primary/10 cursor-pointer">
                            <CheckCircle className="h-4 w-4" /> Accept Session
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleStatusUpdate(booking.id, "CANCELLED")} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-destructive transition-colors focus:bg-destructive/10 cursor-pointer">
                            <XCircle className="h-4 w-4" /> Decline
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

                  {(booking.status === "CONFIRMED" || isOverdue) && booking.status !== "COMPLETED" && booking.status !== "CANCELLED" && booking.paymentStatus === "PAID" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-transparent text-foreground/50 hover:bg-foreground/10 hover:text-foreground transition-colors focus:outline-none">
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-5 w-5" />}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-2xl border border-foreground/10 bg-background p-2 shadow-xl">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator className="my-1 bg-foreground/10" />
                          <DropdownMenuItem onSelect={() => { setActiveBookingId(booking.id); setMeetingLink(booking.meetingLink || ""); setIsLinkModalOpen(true); }} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-foreground transition-colors focus:bg-foreground/5 cursor-pointer">
                            <Video className="h-4 w-4" /> {booking.meetingLink ? "Edit Meeting Link" : "Add Meeting Link"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-1 bg-foreground/10" />
                          <DropdownMenuItem onSelect={() => handleStatusUpdate(booking.id, "COMPLETED")} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-emerald-500 transition-colors focus:bg-emerald-500/10 cursor-pointer">
                            <CheckCircle className="h-4 w-4" /> Mark Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleStatusUpdate(booking.id, "CANCELLED")} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-destructive transition-colors focus:bg-destructive/10 cursor-pointer">
                            <XCircle className="h-4 w-4" /> Cancel Booking
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

                  {booking.status !== "PENDING" && !(booking.status === "CONFIRMED" && booking.paymentStatus === "PAID") && !isOverdue && (
                    <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest px-2">—</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}