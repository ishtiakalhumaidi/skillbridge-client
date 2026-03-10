import { Badge } from "@/components/ui/badge";
import { HeroSearch } from "@/components/shared/HeroSearch";

export function HeroSection() {
  return (
    <section className="relative w-full py-24 md:py-32 overflow-hidden flex flex-col items-center justify-center">
      {/* Modern Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10" />
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center space-y-8 relative z-10">
        <Badge variant="outline" className="px-4 py-1.5 text-sm font-medium bg-background/50 backdrop-blur-sm border-primary/20 text-primary">
           Empowering Learners Worldwide
        </Badge>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight">
          Master any subject with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
            expert tutors
          </span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-[700px] leading-relaxed">
          Accelerate your learning journey with personalized, 1-on-1 tutoring
          from verified professionals tailored to your goals.
        </p>
        
        <div className="w-full max-w-3xl mt-10 p-2 bg-background/50 backdrop-blur-md rounded-2xl border shadow-xl">
          <HeroSearch />
        </div>
      </div>
    </section>
  );
}