import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, MapPin, CheckCircle2 } from "lucide-react"
import { BookingForm } from "./BookingForm"

async function getTutor(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tutors/${id}`, {
      cache: "no-store",
    })
    if (!res.ok) return null
    const responseData = await res.json()
    return responseData?.data
  } catch (error) {
    return null
  }
}

export default async function BookSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const tutor = await getTutor(resolvedParams.id)

  if (!tutor) notFound()

  const user = tutor.user || {}

  return (
    <div className="bg-background min-h-screen py-24 transition-colors duration-700">
      <div className="container mx-auto px-6 max-w-6xl">
        
        <Link href={`/tutors/${tutor.id}`} className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-foreground/50 hover:text-foreground transition-colors mb-16">
          <ArrowLeft className="h-4 w-4" /> Cancel Booking
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* LEFT COLUMN: The Premium Receipt */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-foreground/10 bg-foreground/5 overflow-hidden sticky top-32">
              <div className="p-10 flex flex-col items-center text-center border-b border-foreground/10">
                <div className="h-24 w-24 rounded-full border border-foreground/10 bg-background overflow-hidden mb-6 shadow-sm">
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-head text-3xl text-foreground/30">
                      {user.name?.substring(0, 2).toUpperCase() || "TU"}
                    </div>
                  )}
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">{user.name}</h2>
                <p className="text-sm font-semibold text-foreground/50 mt-1 uppercase tracking-widest">{tutor.headline}</p>
              </div>

              <div className="p-10 space-y-6">
                <div className="flex justify-between items-center text-base font-medium">
                  <span className="text-foreground/60">Hourly Rate</span>
                  <span className="font-bold text-foreground">${tutor.hourlyRate}</span>
                </div>
                <div className="flex justify-between items-center text-base font-medium">
                  <span className="text-foreground/60 flex items-center gap-2"><Clock className="h-4 w-4" /> Duration</span>
                  <span className="font-bold text-foreground">1 Hour</span>
                </div>
                <div className="flex justify-between items-center text-base font-medium">
                  <span className="text-foreground/60 flex items-center gap-2"><MapPin className="h-4 w-4" /> Format</span>
                  <span className="font-bold text-foreground">Virtual Call</span>
                </div>
              </div>

              <div className="bg-primary/10 p-6 border-t border-primary/20 text-sm text-primary flex items-start gap-3 font-semibold">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <p>You won&apos;t be charged until you confirm on the secure Stripe portal.</p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Minimalist Form */}
          <div className="lg:col-span-7 pt-4">
            <h1 className="text-5xl font-head tracking-tighter text-foreground mb-4">Schedule.</h1>
            <p className="text-lg font-medium text-foreground/60 mb-12">
              Select a subject, choose a date, and lock in your time.
            </p>
            <BookingForm tutor={tutor} />
          </div>
          
        </div>
      </div>
    </div>
  )
}