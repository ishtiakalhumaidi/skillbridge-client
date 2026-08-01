/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { format, startOfDay, isBefore } from "date-fns";
import { CalendarX2, Clock, Video, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { ReviewDialog } from "./ReviewDialog";
import { PayNowButton } from "./PayNowButton";
import { LocalTime } from "@/components/shared/LocalTime";

async function getMyBookings() {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/my-bookings`, {
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.data?.bookings ?? [];
  } catch { return []; }
}

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

type StatusConfig = {
  label: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
};

// 👉 Updated with the isOverdue logic
function getStatusConfig(status: string, paymentStatus: string, isOverdue: boolean): StatusConfig {
  if (isOverdue)
    return { label: "Overdue", bg: "bg-destructive/[0.1]", text: "text-destructive", border: "border-destructive/30", dot: "bg-destructive" };

  if (status === "CONFIRMED" && paymentStatus === "UNPAID")
    return { label: "Payment Due", bg: "bg-amber-500/[0.08]", text: "text-amber-600 dark:text-amber-400", border: "border-amber-500/20", dot: "bg-amber-500" };
  if (status === "CONFIRMED" && paymentStatus === "PAID")
    return { label: "Confirmed", bg: "bg-blue-500/[0.08]", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500/20", dot: "bg-blue-500" };
  switch (status) {
    case "PENDING":   return { label: "Awaiting Tutor", bg: "bg-violet-500/[0.08]", text: "text-violet-600 dark:text-violet-400", border: "border-violet-500/20", dot: "bg-violet-500" };
    case "COMPLETED": return { label: "Completed", bg: "bg-primary/[0.08]", text: "text-primary", border: "border-primary/20", dot: "bg-primary" };
    case "CANCELLED": return { label: "Cancelled", bg: "bg-destructive/[0.08]", text: "text-destructive", border: "border-destructive/20", dot: "bg-destructive" };
    default:          return { label: status, bg: "bg-foreground/[0.06]", text: "text-foreground/50", border: "border-foreground/10", dot: "bg-foreground/40" };
  }
}

function StatusBadge({ status, paymentStatus, isOverdue }: { status: string; paymentStatus: string; isOverdue: boolean }) {
  const cfg = getStatusConfig(status, paymentStatus, isOverdue);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      {isOverdue ? <AlertCircle className="h-3 w-3 shrink-0" /> : <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />}
      {cfg.label}
    </span>
  );
}

export default async function BookingsPage() {
  const fetched = await getMyBookings();
  const rawBookings = Array.isArray(fetched) ? fetched : [];

  // 👉 The exact same 3-Tier Priority Sorting Logic (Executed on the Server!)
  const today = startOfDay(new Date());
  
  const sortedBookings = [...rawBookings].sort((a, b) => {
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

  return (
    <div className="w-full max-w-4xl space-y-10">

      {/* Page header */}
      <div className="pb-6 border-b border-foreground/[0.07]">
        <div className="flex items-center gap-3 mb-3">
          <span className="h-px w-8 bg-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Sessions</span>
        </div>
        <h1 className="text-4xl font-head tracking-tighter text-foreground leading-[0.9]">
          My Bookings.
        </h1>
        <p className="text-sm font-medium text-foreground/50 mt-2">
          View and manage your upcoming and past tutoring sessions.
        </p>
      </div>

      {/* Empty state */}
      {sortedBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center rounded-2xl border border-foreground/[0.07] bg-foreground/[0.02]">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-foreground/[0.07] bg-foreground/[0.04] mb-5">
            <CalendarX2 className="h-6 w-6 text-foreground/30" />
          </div>
          <h3 className="text-xl font-head tracking-tight text-foreground mb-2">No bookings yet</h3>
          <p className="text-sm font-medium text-foreground/45 max-w-xs leading-relaxed mb-7">
            You haven&apos;t booked any sessions yet. Find an expert tutor to get started.
          </p>
          <Link
            href="/tutors"
            className="group inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-2.5 text-sm font-bold text-background transition-all duration-300 hover:bg-primary hover:shadow-[0_8px_24px_rgba(37,99,235,0.25)] active:scale-95"
          >
            Browse Tutors
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {sortedBookings.map((booking: any) => {
            const name = booking.tutor?.user?.name || "Unknown Tutor";
            const palette = avatarPalette(name);
            
            // 👉 Calculate Overdue status for the styling
            const isOverdue = isBefore(new Date(booking.date), today) && booking.status !== "COMPLETED" && booking.status !== "CANCELLED";

            return (
              <div
                key={booking.id}
                className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-5 rounded-2xl border p-5 md:p-6 transition-all duration-300 ${
                  isOverdue
                    ? "border-destructive/40 bg-destructive/[0.02] hover:border-destructive/60"
                    : "border-foreground/[0.07] bg-background hover:border-primary/25 hover:shadow-[0_8px_32px_-8px_rgba(37,99,235,0.08)]"
                }`}
              >
                {/* Left: tutor info */}
                <div className="flex items-center gap-4 min-w-0">
                  {/* Avatar */}
                  <div
                    className="h-12 w-12 rounded-xl overflow-hidden shrink-0 border border-foreground/[0.07] flex items-center justify-center font-head text-sm font-bold"
                    style={{ background: palette.bg, color: palette.color }}
                  >
                    {booking.tutor?.user?.image ? (
                      <img
                        src={booking.tutor.user.image}
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      name.substring(0, 2).toUpperCase()
                    )}
                  </div>

                  {/* Details */}
                  <div className="min-w-0">
                    <h3 className={`text-sm font-bold truncate transition-colors duration-300 ${isOverdue ? "text-destructive" : "text-foreground group-hover:text-primary"}`}>
                      {name}
                    </h3>
                    <p className="text-xs font-semibold text-foreground/45 mt-0.5 truncate">
                      {booking.category?.name || "Subject N/A"}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-foreground/40">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      <span>
                        {format(new Date(booking.date), "MMM d, yyyy")}
                        {" · "}
                        <LocalTime dateStr={booking.startTime} />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: status + action */}
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-4 sm:pt-0 border-t border-foreground/[0.06] sm:border-0 shrink-0">
                  <StatusBadge status={booking.status} paymentStatus={booking.paymentStatus} isOverdue={isOverdue} />

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {booking.status === "PENDING" && !isOverdue && (
                      <span className="text-[10px] font-bold text-foreground/35 uppercase tracking-widest">
                        Pending approval
                      </span>
                    )}

                    {booking.status === "CONFIRMED" && booking.paymentStatus === "UNPAID" && (
                      <PayNowButton bookingId={booking.id} />
                    )}

                    {booking.status === "CONFIRMED" && booking.paymentStatus === "PAID" && !isOverdue && (
                      booking.meetingLink ? (
                        <a
                          href={booking.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="group/btn inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground transition-all duration-300 hover:shadow-[0_4px_16px_rgba(37,99,235,0.3)] active:scale-95"
                        >
                          <Video className="h-3.5 w-3.5" />
                          Join Meeting
                        </a>
                      ) : (
                        <span className="text-[10px] font-bold text-primary/70 uppercase tracking-widest">
                          Link pending
                        </span>
                      )
                    )}

                    {booking.status === "COMPLETED" && (
                      <ReviewDialog
                        bookingId={booking.id}
                        tutorName={name}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}