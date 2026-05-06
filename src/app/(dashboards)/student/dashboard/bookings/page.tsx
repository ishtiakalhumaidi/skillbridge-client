/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers"
import { format } from "date-fns"
import { CalendarX2, Clock, Video } from "lucide-react"
import { ReviewDialog } from "./ReviewDialog"
import { PayNowButton } from "./PayNowButton"

async function getMyBookings() {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/my-bookings`, {
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    });
    
    if (!res.ok) return [];
    const responseData = await res.json();
    return responseData?.data?.bookings || [];
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
}

function StatusBadge({ status, paymentStatus }: { status: string, paymentStatus: string }) {
  if (status === "CONFIRMED" && paymentStatus === "UNPAID") {
    return <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-bold text-amber-500 uppercase tracking-widest border border-amber-500/20">Payment Due</span>;
  }
  if (status === "CONFIRMED" && paymentStatus === "PAID") {
    return <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-[10px] font-bold text-blue-500 uppercase tracking-widest border border-blue-500/20">Confirmed & Paid</span>;
  }
  switch (status) {
    case "PENDING":
      return <span className="inline-flex items-center rounded-full bg-purple-500/10 px-3 py-1 text-[10px] font-bold text-purple-500 uppercase tracking-widest border border-purple-500/20">Awaiting Tutor</span>;
    case "COMPLETED":
      return <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary uppercase tracking-widest border border-primary/20">Completed</span>;
    case "CANCELLED":
      return <span className="inline-flex items-center rounded-full bg-destructive/10 px-3 py-1 text-[10px] font-bold text-destructive uppercase tracking-widest border border-destructive/20">Cancelled</span>;
    default:
      return <span className="inline-flex items-center rounded-full bg-foreground/10 px-3 py-1 text-[10px] font-bold text-foreground/60 uppercase tracking-widest border border-foreground/10">{status}</span>;
  }
}

export default async function BookingsPage() {
  const fetchedBookings = await getMyBookings();
  const bookings = Array.isArray(fetchedBookings) ? fetchedBookings : [];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full max-w-5xl">
      
      <div className="border-b border-foreground/10 pb-6">
        <h1 className="text-4xl font-head tracking-tighter text-foreground">My Bookings.</h1>
        <p className="text-lg font-medium text-foreground/60 mt-2">
          View and manage your upcoming and past tutoring sessions.
        </p>
      </div>

      <div>
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-foreground/5 rounded-3xl border border-foreground/10 shadow-sm">
            <div className="bg-background p-5 rounded-2xl border border-foreground/10 mb-6 shadow-sm">
              <CalendarX2 className="h-10 w-10 text-foreground/30" />
            </div>
            <h3 className="text-2xl font-head tracking-tighter mb-2 text-foreground">No bookings found</h3>
            <p className="text-base font-medium text-foreground/60 max-w-sm">
              You haven&apos;t booked any sessions yet. Head over to the tutors page to find an expert.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {bookings.map((booking: any) => (
              <div key={booking.id} className="group flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8 rounded-3xl border border-foreground/10 bg-background hover:border-primary hover:shadow-md transition-all duration-300">
                
                <div className="flex items-center gap-6 mb-6 md:mb-0">
                  <div className="h-16 w-16 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center font-head text-xl text-foreground/50 shrink-0 overflow-hidden">
                     {booking.tutor?.user?.image ? (
                        <img src={booking.tutor.user.image} alt="Tutor" className="w-full h-full object-cover" />
                     ) : (
                        booking.tutor?.user?.name?.substring(0, 2).toUpperCase() || "TU"
                     )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{booking.tutor?.user?.name || "Unknown Tutor"}</h3>
                    <p className="text-sm font-semibold text-foreground/60 mt-1">{booking.category?.name || "Subject N/A"}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm font-medium text-foreground/50">
                      <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {format(new Date(booking.date), "MMM dd")} ({booking.startTime})</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 border-t border-foreground/10 md:border-t-0 pt-4 md:pt-0">
                  <StatusBadge status={booking.status} paymentStatus={booking.paymentStatus} />
                  
                  {booking.status === "PENDING" && (
                    <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mt-2">Awaiting Approval</span>
                  )}
                  {booking.status === "CONFIRMED" && booking.paymentStatus === "UNPAID" && (
                    <PayNowButton bookingId={booking.id} />
                  )}
                  
                  {/* The New Meeting Link Display */}
                  {booking.status === "CONFIRMED" && booking.paymentStatus === "PAID" && (
                    <div className="flex flex-col items-end mt-2 gap-2">
                       {booking.meetingLink ? (
                         <a href={booking.meetingLink} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition-all hover:scale-105 active:scale-95 shadow-md">
                           <Video className="h-4 w-4" /> Join Meeting
                         </a>
                       ) : (
                         <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Awaiting Link from Tutor</span>
                       )}
                    </div>
                  )}

                  {booking.status === "COMPLETED" && (
                    <ReviewDialog 
                      bookingId={booking.id} 
                      tutorName={booking.tutor?.user?.name || "Tutor"} 
                    />
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}