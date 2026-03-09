import { cookies } from "next/headers"
import { AvailabilityManager } from "./AvailabilityManager"

async function getMyAvailability() {
  try {
    const cookieStore = await cookies();
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/availability/my-availability`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });
    
    if (!res.ok) return [];
    
    const responseData = await res.json();
    return responseData?.data || [];
  } catch (error) {
    console.error("Error fetching availability:", error);
    return [];
  }
}

export default async function TutorAvailabilityPage() {
  const slots = await getMyAvailability();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Availability</h1>
        <p className="text-muted-foreground mt-1">
          Set the days and times you are available to teach students. 
        </p>
      </div>

      <AvailabilityManager initialSlots={slots} />
    </div>
  )
}