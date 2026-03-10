import Link from "next/link";
import { Star, GraduationCap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function FeaturedTutors({ tutors }: { tutors: any[] }) {
  if (!tutors || tutors.length === 0) return null;

  return (
    <section className="w-full py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold tracking-tight">Learn from the Best</h2>
          <p className="text-muted-foreground max-w-[700px] text-lg">
            Our top-rated tutors are vetted professionals ready to help you achieve your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tutors.map((tutor: any) => (
            <Card key={tutor.id} className="group flex flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 border-muted/50">
              <CardHeader className="flex flex-col items-center text-center space-y-4 pb-4 pt-8">
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg ring-2 ring-primary/10">
                  <AvatarImage src={tutor.user?.image} alt={tutor.user?.name} className="object-cover" />
                  <AvatarFallback className="font-mono text-2xl bg-primary/5 text-primary">
                    {tutor.user?.name?.substring(0, 2).toUpperCase() || "TU"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex flex-col space-y-1 items-center w-full">
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                    {tutor.user?.name || "Tutor"}
                  </CardTitle>
                  <CardDescription className="flex items-center justify-center space-x-2 text-md font-medium">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <span>{tutor.headline || "Professional Educator"}</span>
                  </CardDescription>
                  <div className="flex items-center space-x-1 text-sm font-bold pt-2 text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full">
                    <Star className="h-4 w-4 fill-current" />
                    <span>{tutor.ratingAvg?.toFixed(1) || "5.0"} Rating</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 text-center px-6">
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {tutor.bio || "Passionate about helping students achieve their goals through personalized, engaging, and effective tutoring sessions."}
                </p>
              </CardContent>
              
              <CardFooter className="flex items-center justify-between border-t bg-muted/10 p-6 mt-4">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Rate</span>
                  <span className="text-2xl font-black text-primary">
                    ${tutor.hourlyRate || "25"}<span className="text-sm font-normal text-muted-foreground">/hr</span>
                  </span>
                </div>
                <Link href={`/tutors/${tutor.id}`}>
                  <Button variant="default" className="font-medium rounded-full shadow-md group-hover:shadow-lg transition-all">
                    Book Session
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Link href="/tutors">
            <Button size="lg" variant="outline" className="gap-2 rounded-full border-primary/20 hover:bg-primary/5">
              View All Expert Tutors <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}