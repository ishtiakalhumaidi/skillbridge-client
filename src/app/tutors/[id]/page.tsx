import { Star, MapPin, GraduationCap, Clock, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
type PageProps = {
  params: Promise<{ id: string }>
}

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
    console.error("Error fetching tutor:", error);
    return null;
  }
}

export default async function TutorProfilePage({ params }: PageProps) {
 const resolvedParams = await params;
  const tutor = await getTutor(resolvedParams.id);

  if (!tutor) {
    notFound(); 
  }

  const user = tutor.user || {};

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
      {/* Back Button */}
      <Link href="/tutors" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
        ← Back to all tutors
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content (Left Side) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-primary/10">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback className="font-mono text-3xl bg-primary/5 text-primary">
                {user.name?.substring(0, 2).toUpperCase() || "TU"}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-2 flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">{user.name || "Tutor Name"}</h1>
                  <p className="text-xl text-muted-foreground flex items-center gap-2 mt-1">
                    <GraduationCap className="h-5 w-5" />
                    {tutor.headline || "Professional Educator"}
                  </p>
                </div>
                {tutor.isFeatured && (
                  <Badge variant="default" className="flex w-fit items-center gap-1">
                    <Star className="h-3 w-3 fill-current" /> Featured
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 pt-2">
                {(tutor.subjects || []).map((subject: any, idx: number) => (
                  <Badge key={idx} variant="secondary">
                    {subject.category?.name || subject.name || "Subject"}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({tutor.reviews?.length || 0})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="space-y-6 mt-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Biography</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {tutor.bio || "No biography provided yet."}
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Availability Setup</h3>
                {tutor.availability?.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {tutor.availability.map((slot: any, idx: number) => (
                      <div key={idx} className="flex flex-col p-3 rounded-md border bg-card text-center">
                        <span className="font-medium text-sm capitalize">{slot.day}</span>
                        <span className="text-xs text-muted-foreground">{slot.startTime} - {slot.endTime}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Tutor hasn't set up availability slots yet.</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="space-y-6 mt-6">
              {tutor.reviews?.length > 0 ? (
                tutor.reviews.map((review: any, idx: number) => (
                  <Card key={idx} className="border-none shadow-none bg-muted/20">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary font-mono">
                              {review.student?.name?.substring(0, 2).toUpperCase() || "ST"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm">{review.student?.name || "Student"}</span>
                        </div>
                        <div className="flex items-center text-amber-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="ml-1 text-sm font-medium">{review.rating}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 border rounded-lg bg-card/50">
                  <p className="text-muted-foreground">No reviews yet for this tutor.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sticky Booking Sidebar (Right Side) */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 border-primary/20 shadow-sm">
            <CardHeader>
              <CardTitle>Book a Session</CardTitle>
              <CardDescription>Reserve your time with {user.name?.split(' ')[0] || "this tutor"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Hourly Rate</span>
                <span className="text-2xl font-bold font-mono text-primary">${tutor.hourlyRate || "0"}<span className="text-sm font-sans text-muted-foreground font-normal">/hr</span></span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Instant booking confirmation</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Cancel up to 24h before</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/tutors/${tutor.id}/book`} className="w-full">
                <Button className="w-full font-medium h-12 text-md">
                  Book Session Now
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

      </div>
    </div>
  )
}