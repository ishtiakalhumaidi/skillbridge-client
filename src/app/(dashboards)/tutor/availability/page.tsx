import { cookies } from "next/headers";
import { AvailabilityManager } from "./AvailabilityManager";

async function getMyAvailability() {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/availability/my-availability`, {
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.data ?? [];
  } catch { return []; }
}

export default async function TutorAvailabilityPage() {
  const slots = await getMyAvailability();

  return (
    <div className="w-full max-w-5xl space-y-10">

      {/* Page header */}
      <div className="pb-6 border-b border-foreground/[0.07]">
        <div className="flex items-center gap-3 mb-3">
          <span className="h-px w-8 bg-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Schedule</span>
        </div>
        <h1 className="text-4xl font-head tracking-tighter text-foreground leading-[0.9]">
          Availability.
        </h1>
        <p className="text-sm font-medium text-foreground/50 mt-2">
          Set the days and times you are available to teach students.
        </p>
      </div>

      <AvailabilityManager initialSlots={slots} />
    </div>
  );
}