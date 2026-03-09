import Link from "next/link"
import { Star, GraduationCap, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { HeroSearch } from "@/components/shared/HeroSearch"

// Fetch only featured tutors for the homepage
async function getFeaturedTutors() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tutors?isFeatured=true&limit=3`, {
      next: { revalidate: 3600 }, // Cache this for an hour since featured status rarely changes
    });
    
    if (!res.ok) return [];
    
    const responseData = await res.json();
    return responseData?.data?.tutors || [];
  } catch (error) {
    console.error("Error fetching featured tutors:", error);
    return [];
  }
}

export default async function Home() {
  const featuredTutors = await getFeaturedTutors();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 bg-muted/30 border-b">
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center space-y-8">
          <Badge variant="secondary" className="px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            🎓 Welcome to SkillBridge
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl">
            Connect with <span className="text-primary font-mono">Expert Tutors</span>, Learn Anything.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Master new skills with personalized, 1-on-1 tutoring sessions. 
            Browse verified professionals, view availability, and book instantly.
          </p>
          
          <div className="w-full flex justify-center pt-4">
            <HeroSearch />
          </div>

          <div className="flex items-center gap-6 pt-4 text-sm font-medium text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" /> Verified Experts
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" /> Instant Booking
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" /> Secure Payments
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tutors Section */}
      <section className="w-full py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Featured Educators</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Learn from the highest-rated professionals on our platform.
            </p>
          </div>

          {featuredTutors.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredTutors.map((tutor: any) => (
                <Card key={tutor.id} className="flex flex-col overflow-hidden transition-all hover:shadow-md border-primary/10">
                  <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
                    <Avatar className="h-16 w-16 border-2 border-primary/10">
                      <AvatarImage src={tutor.user?.image} alt={tutor.user?.name} />
                      <AvatarFallback className="font-mono text-lg bg-primary/5 text-primary">
                        {tutor.user?.name?.substring(0, 2).toUpperCase() || "TU"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{tutor.user?.name || "Expert Tutor"}</CardTitle>
                        <div className="flex items-center space-x-1 text-sm font-medium text-amber-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span>{tutor.rating?.toFixed(1) || "5.0"}</span>
                        </div>
                      </div>
                      <CardDescription className="flex items-center space-x-1">
                        <GraduationCap className="h-3.5 w-3.5" />
                        <span>{tutor.headline || "Professional Educator"}</span>
                      </CardDescription>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 pb-4">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {tutor.bio || "Passionate about helping students achieve their goals through personalized tutoring."}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(tutor.subjects || []).slice(0, 2).map((subject: any, idx: number) => (
                        <Badge key={idx} variant="secondary" className="font-medium">
                          {subject.category?.name || "Subject"}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="flex items-center justify-between border-t bg-muted/10 p-4">
                    <span className="text-lg font-bold">
                      ${tutor.hourlyRate || "25"}<span className="text-sm font-normal text-muted-foreground">/hr</span>
                    </span>
                    <Link href={`/tutors/${tutor.id}`}>
                      <Button variant="default" size="sm" className="font-medium">
                        View Profile
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No featured tutors at the moment.</p>
            </div>
          )}
          
          <div className="mt-12 flex justify-center">
            <Link href="/tutors">
              <Button variant="outline" size="lg" className="font-medium">
                Browse All Tutors
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full py-20 bg-muted/30 border-t">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How SkillBridge Works</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Get started on your learning journey in three simple steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto">
            <div className="flex flex-col items-center space-y-3 p-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold font-mono">1</div>
              <h3 className="text-xl font-bold">Find a Tutor</h3>
              <p className="text-muted-foreground">Search by subject, review profiles, and check out tutor ratings to find your perfect match.</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold font-mono">2</div>
              <h3 className="text-xl font-bold">Book a Time</h3>
              <p className="text-muted-foreground">View the tutor's live availability and instantly lock in a time slot that works for your schedule.</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold font-mono">3</div>
              <h3 className="text-xl font-bold">Start Learning</h3>
              <p className="text-muted-foreground">Connect with your tutor, achieve your goals, and leave a review to help others.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}