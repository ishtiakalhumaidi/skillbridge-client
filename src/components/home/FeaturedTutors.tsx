/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

export function FeaturedTutors({ tutors }: { tutors: any[] }) {
  if (!tutors || !Array.isArray(tutors) || tutors.length === 0) return null;

  return (
    <section className="w-full py-32">
      <div className="container mx-auto px-6 md:px-12">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-head tracking-tighter mb-6 text-foreground">Elite Mentors.</h2>
            <p className="text-xl md:text-2xl text-foreground/60 font-medium">Learn directly from vetted professionals who have mastered exactly what you want to achieve.</p>
          </div>
          <Link href="/tutors" className="group flex items-center justify-center h-14 rounded-full bg-foreground px-8 text-sm font-bold text-background transition-all hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95 whitespace-nowrap">
            View all mentors
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {tutors.map((tutor: any) => (
            <Link 
              key={tutor.id} 
              href={`/tutors/${tutor.id}`}
              className="group flex flex-col rounded-3xl border border-foreground/10 bg-background p-8 transition-all duration-500 hover:border-primary hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.02)] hover:-translate-y-2"
            >
              <div className="flex items-center gap-6 mb-8">
                <div className="h-20 w-20 rounded-full bg-foreground/5 overflow-hidden border border-foreground/10 group-hover:border-primary transition-colors shrink-0">
                  {tutor.user?.image ? (
                    <img src={tutor.user.image} alt={tutor.user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-head text-xl text-foreground/40">
                      {tutor.user?.name?.substring(0, 2).toUpperCase() || "TU"}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">{tutor.user?.name || "Tutor"}</h3>
                  <p className="text-sm font-semibold text-foreground/50 mt-1">{tutor.headline || "Educator"}</p>
                </div>
              </div>
              
              <p className="text-base text-foreground/70 leading-relaxed line-clamp-3 mb-10 flex-1">
                &quot;{tutor.bio || "Passionate about helping students achieve their goals through personalized tutoring."}&quot;
              </p>
              
              <div className="flex items-center justify-between pt-6 border-t border-foreground/10">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <Star className="h-5 w-5 text-primary fill-primary" />
                  <span>{tutor.ratingAvg?.toFixed(1) || "5.0"}</span>
                </div>
                <div className="text-xl font-bold tracking-tight text-foreground">
                  ${tutor.hourlyRate || "25"}<span className="text-sm font-medium text-foreground/50">/hr</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}