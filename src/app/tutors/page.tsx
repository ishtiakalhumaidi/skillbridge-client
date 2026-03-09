import Link from "next/link"
import { Star, GraduationCap } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// A safer fetch function that won't crash on URL construction
async function getTutors(searchQuery?: string) {
  try {
    // Safely construct the URL using standard strings
    let fetchUrl = `${process.env.NEXT_PUBLIC_API_URL}/tutors`;
    
    if (searchQuery) {
      // Add the query parameter if a search exists
      fetchUrl += `?search=${encodeURIComponent(searchQuery)}`;
    }

    const res = await fetch(fetchUrl, {
      cache: "no-store", // Ensures fresh data every time
    });
    
    if (!res.ok) throw new Error("Failed to fetch tutors");
    
    const responseData = await res.json();
    return responseData?.data?.tutors || []; 
  } catch (error) {
    console.error("Error fetching tutors:", error);
    return [];
  }
}

export default async function TutorsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ search?: string }> 
}) {
  // Await the searchParams Promise in Next.js 16
  const resolvedParams = await searchParams;
  const tutors = await getTutors(resolvedParams.search);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {resolvedParams.search ? `Search Results for "${resolvedParams.search}"` : "Expert Tutors"}
        </h1>
        <p className="text-muted-foreground max-w-[700px] text-lg">
          {resolvedParams.search 
            ? "Here are the tutors matching your search." 
            : "Browse our verified professionals and find the perfect match for your learning journey."}
        </p>
      </div>

      {tutors.length === 0 ? (
        <div className="text-center py-20 border rounded-lg bg-card text-muted-foreground">
          {resolvedParams.search 
            ? `No tutors found matching "${resolvedParams.search}". Try a different subject or name!` 
            : "No tutors found at the moment. Please check back later!"}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tutors.map((tutor: any) => (
            <Card key={tutor.id} className="flex flex-col overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
                <Avatar className="h-16 w-16 border-2 border-primary/10">
                  <AvatarImage src={tutor.user?.image} alt={tutor.user?.name} />
                  <AvatarFallback className="font-mono text-lg bg-primary/5 text-primary">
                    {tutor.user?.name?.substring(0, 2).toUpperCase() || "TU"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{tutor.user?.name || "Tutor Name"}</CardTitle>
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
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {tutor.bio || "Passionate about helping students achieve their goals through personalized, engaging, and effective tutoring sessions."}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {(tutor.subjects || []).slice(0, 3).map((subject: any, idx: number) => (
                    <Badge key={idx} variant="secondary" className="font-medium">
                      {subject.category?.name || subject.name || "Subject"}
                    </Badge>
                  ))}
                  {(tutor.subjects?.length > 3) && (
                    <Badge variant="outline">+{tutor.subjects.length - 3}</Badge>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between border-t bg-muted/20 p-4">
                <div className="flex flex-col">
                  <span className="text-lg font-bold">
                    ${tutor.hourlyRate || "25"}<span className="text-sm font-normal text-muted-foreground">/hr</span>
                  </span>
                </div>
                <Link href={`/tutors/${tutor.id}`}>
                  <Button variant="default" className="font-medium">
                    View Profile
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}