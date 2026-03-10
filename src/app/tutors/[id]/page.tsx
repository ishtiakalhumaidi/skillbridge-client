import Link from "next/link"
import { Star, Clock } from "lucide-react"
import { notFound } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

async function getTutor(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tutors/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Failed to fetch tutor");
    }
    const responseData = await res.json();
    return responseData?.data;
  } catch (error) {
    return null;
  }
}

export default async function TutorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const tutor = await getTutor(resolvedParams.id);

  if (!tutor) {
    notFound();
  }

  const user = tutor.user || {};

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column - Fixed Info & Booking */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-none shadow-sm bg-card/50 sticky top-24">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24 border-4 border-background shadow-sm">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback className="text-2xl font-mono bg-primary/10 text-primary">
                    {user.name?.substring(0, 2).toUpperCase() || "TU"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription className="text-base">{tutor.headline || "Professional Educator"}</CardDescription>
              
              <div className="flex items-center justify-center gap-1 text-amber-500 mt-2 font-medium">
                <Star className="h-5 w-5 fill-current" />
                <span>{tutor.rating?.toFixed(1) || "5.0"}</span>
                <span className="text-muted-foreground text-sm font-normal ml-1">
                  ({tutor.reviews?.length || 0} reviews)
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-y">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Hourly Rate
                </span>
                <span className="font-bold text-lg">${tutor.hourlyRate || 25}/hr</span>
              </div>
              <Link href={`/tutors/${tutor.id}/book`} className="block w-full">
                <Button className="w-full text-md h-12">Book Session</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Details, Subjects, & Reviews */}
        <div className="md:col-span-2 space-y-10">
          
          {/* About Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">About Me</h2>
            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-foreground">
              {tutor.bio ? (
                <p className="whitespace-pre-wrap leading-relaxed">{tutor.bio}</p>
              ) : (
                <p className="italic">This tutor hasn't written a bio yet.</p>
              )}
            </div>
          </section>

          {/* Subjects Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Subjects</h2>
            <div className="flex flex-wrap gap-2">
              {tutor.subjects?.length > 0 ? (
                tutor.subjects.map((sub: any) => (
                  <Badge key={sub.categoryId} variant="secondary" className="px-3 py-1.5 text-sm font-medium">
                    {sub.category?.name || "Subject"}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground italic text-sm">No subjects listed.</p>
              )}
            </div>
          </section>

          {/* 💡 THE NEW REVIEWS SECTION */}
          <section className="space-y-4 pt-6 border-t">
            <h2 className="text-2xl font-bold tracking-tight">Student Feedback</h2>
            
            {tutor.reviews && tutor.reviews.length > 0 ? (
              <div className="space-y-4">
                {tutor.reviews.map((review: any) => (
                  <Card key={review.id} className="border-none shadow-sm bg-muted/30">
                    <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={review.student?.image} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-mono">
                            {review.student?.name?.substring(0, 2).toUpperCase() || "ST"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{review.student?.name || "Anonymous Student"}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      
                      {/* Dynamic Star Rating */}
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < review.rating ? "fill-current" : "text-muted stroke-muted-foreground"}`} 
                          />
                        ))}
                      </div>
                    </CardHeader>
                    {review.comment && (
                      <CardContent className="text-sm text-muted-foreground pt-2">
                        "{review.comment}"
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border rounded-lg border-dashed bg-card/50">
                <Star className="h-8 w-8 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">No reviews yet.</p>
                <p className="text-sm text-muted-foreground mt-1">Be the first to book a session and leave feedback!</p>
              </div>
            )}
          </section>
          
        </div>
      </div>
    </div>
  )
}