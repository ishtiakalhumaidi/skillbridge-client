/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { TutorBookingsTable } from "./TutorBookingsTable";

async function getMyBookings() {
  try {
    const cookieStore = await cookies();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/bookings/my-bookings`,
      {
        headers: { Cookie: cookieStore.toString() },
        cache: "no-store",
      },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data?.data?.bookings ?? data?.data ?? [];
  } catch {
    return [];
  }
}

async function getSession() {
  try {
    const cookieStore = await cookies();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/get-session`,
      {
        headers: { Cookie: cookieStore.toString() },
        cache: "no-store",
      },
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function TutorSessionsPage() {
  const [bookings, session] = await Promise.all([
    getMyBookings(),
    getSession(),
  ]);
  const currentUserId = session?.user?.id;

  const tutorBookings = Array.isArray(bookings)
    ? bookings.filter((b: any) => b.tutor?.userId === currentUserId)
    : [];

  return (
    <div className="w-full max-w-5xl space-y-10">
      <div className="pb-6 border-b border-foreground/[0.07]">
        <div className="flex items-center gap-3 mb-3">
          <span className="h-px w-8 bg-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Management
          </span>
        </div>
        <h1 className="text-4xl font-head tracking-tighter text-foreground leading-[0.9]">
          Active Sessions.
        </h1>
        <p className="text-sm font-medium text-foreground/50 mt-2">
          Accept, decline, add meeting links, and mark sessions complete.
        </p>
      </div>

      {currentUserId ? (
        <TutorBookingsTable
          initialBookings={tutorBookings}
          currentUserId={currentUserId}
        />
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/[0.06] px-5 py-4">
          <span className="h-2 w-2 rounded-full bg-destructive animate-pulse shrink-0" />
          <p className="text-sm font-bold text-destructive">
            Authentication error. Please log in again.
          </p>
        </div>
      )}
    </div>
  );
}
