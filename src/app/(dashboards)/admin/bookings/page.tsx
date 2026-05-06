import { cookies } from "next/headers"
import { AdminBookingsTable } from "./AdminBookingsTable"

async function getAllBookings() {
  try {
    const cookieStore = await cookies();
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/bookings`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });
    
    if (!res.ok) return [];
    
    const responseData = await res.json();
    // console.log(responseData);
    return responseData?.data.bookings || [];
  } catch (error) {
    console.error("Error fetching admin bookings:", error);
    return [];
  }
}

export default async function AdminBookingsPage() {
  const bookings = await getAllBookings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Bookings Overview</h1>
        <p className="text-muted-foreground mt-1">
          Monitor all tutoring sessions across the platform.
        </p>
      </div>

      <AdminBookingsTable bookings={bookings} />
    </div>
  )
}