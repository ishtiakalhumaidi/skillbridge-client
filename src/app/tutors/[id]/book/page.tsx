import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

  if (!tutor) {
    notFound()
  }

  const user = tutor.user || {}

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      <Link href={`/tutors/${tutor.id}`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6">
        ← Cancel and return to profile
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Tutor Summary */}
        <div className="md:col-span-1">
          <Card className="bg-muted/10 border-none shadow-sm sticky top-24">
            <CardHeader>
              <Avatar className="h-20 w-20 mb-4 border-2 border-primary/10">
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback className="font-mono text-xl bg-primary/5 text-primary">
                  {user.name?.substring(0, 2).toUpperCase() || "TU"}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <CardDescription>{tutor.headline}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rate</span>
                  <span className="font-medium">${tutor.hourlyRate}/hr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">1 Hour</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: The Booking Form */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Finalize Your Booking</CardTitle>
              <CardDescription>
                Select a subject, choose a date, and pick an available time slot to secure your session.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BookingForm tutor={tutor} />
            </CardContent>
          </Card>
        </div>
        
      </div>
    </div>
  )
}