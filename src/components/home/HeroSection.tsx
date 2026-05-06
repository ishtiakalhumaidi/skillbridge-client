import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroSearch } from "@/components/shared/HeroSearch";

export function HeroSection() {
  return (
    <section className="w-full flex flex-col items-center justify-center pt-32 pb-24 md:pt-18 md:pb-32 px-6 text-center transition-colors duration-700">
      
      <div className="inline-flex items-center gap-3 rounded-full bg-foreground/5 px-5 py-2 text-sm font-semibold text-foreground/80 mb-10 transition-colors hover:bg-foreground/10 border border-foreground/5">
        <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
        The new standard for learning.
      </div>
      
      <h1 className="text-6xl md:text-8xl lg:text-9xl font-head tracking-tighter leading-[0.9] max-w-5xl mb-8">
        Master your craft. <br className="hidden md:block" />
        <span className="text-foreground/30">Zero limits.</span>
      </h1>
      
      <p className="text-xl md:text-2xl font-medium text-foreground/60 max-w-2xl mb-14 leading-relaxed">
        Don&apos;t just pass. Excel. Connect with world-class experts and elevate your skills through 1-on-1 personalized mentorship.
      </p>
      
      <div className="w-full max-w-2xl mx-auto mb-32 relative z-10">
        <HeroSearch />
      </div>

      {/* Ultra-Minimalist Infinite Marquee */}
      <div className="w-full border-y border-foreground/10 py-8 overflow-hidden flex whitespace-nowrap relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10"></div>
        
        <div className="animate-marquee flex gap-16 items-center">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-16 items-center text-foreground/40 font-head uppercase tracking-widest text-2xl">
              <span className="hover:text-foreground transition-colors cursor-default">Mathematics</span>
              <span className="hover:text-foreground transition-colors cursor-default">Computer Science</span>
              <span className="hover:text-foreground transition-colors cursor-default">Physics</span>
              <span className="hover:text-foreground transition-colors cursor-default">Languages</span>
              <span className="hover:text-foreground transition-colors cursor-default">Business</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}