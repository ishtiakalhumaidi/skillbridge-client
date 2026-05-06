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
    <div className="space-y-12 w-full max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="border-b border-foreground/10 pb-6">
        <h1 className="text-4xl font-head tracking-tighter text-foreground">Availability.</h1>
        <p className="text-lg font-medium text-foreground/60 mt-2">
          Set the days and times you are available to teach students.
        </p>
      </div>

      <AvailabilityManager initialSlots={slots} />
    </div>
  )
}