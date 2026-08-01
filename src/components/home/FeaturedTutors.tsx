"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { Star, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function useScrollReveal(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setRevealed(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, revealed };
}

// Deterministic avatar color from name
function avatarColor(name = "") {
  const colors = [
    { bg: "bg-blue-50 dark:bg-blue-950", text: "text-blue-700 dark:text-blue-300" },
    { bg: "bg-teal-50 dark:bg-teal-950", text: "text-teal-700 dark:text-teal-300" },
    { bg: "bg-violet-50 dark:bg-violet-950", text: "text-violet-700 dark:text-violet-300" },
    { bg: "bg-amber-50 dark:bg-amber-950", text: "text-amber-700 dark:text-amber-300" },
    { bg: "bg-rose-50 dark:bg-rose-950", text: "text-rose-700 dark:text-rose-300" },
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

export function FeaturedTutors({ tutors }: { tutors: any[] }) {
  const { ref, revealed } = useScrollReveal();

  if (!tutors || !Array.isArray(tutors) || tutors.length === 0) return null;

  return (
    <section className="w-full py-32 border-t border-foreground/[0.07]">
      <div className="container mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-10 bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Mentors</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-head tracking-tighter mb-4 text-foreground leading-[0.9]">
              Elite Mentors.
            </h2>
            <p className="text-lg text-foreground/50 font-medium max-w-md">
              Learn directly from vetted professionals who have mastered exactly what you want to achieve.
            </p>
          </div>
          <Link
            href="/tutors"
            className="group flex items-center gap-2 h-12 rounded-full border border-foreground/15 px-7 text-sm font-semibold text-foreground/70 transition-all duration-300 hover:border-primary hover:text-primary hover:bg-primary/5 active:scale-95 whitespace-nowrap"
          >
            View all mentors
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Cards */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tutors.map((tutor: any, i: number) => {
            const name = tutor.user?.name || "Tutor";
            const initials = name.substring(0, 2).toUpperCase();
            const color = avatarColor(name);

            return (
              <Link
                key={tutor.id}
                href={`/tutors/${tutor.id}`}
                className="group outline-none"
                style={{
                  opacity: revealed ? 1 : 0,
                  transform: revealed ? "translateY(0)" : "translateY(32px)",
                  transition: `opacity 0.65s ease ${i * 90}ms, transform 0.65s ease ${i * 90}ms`,
                }}
              >
                <div className="relative flex flex-col h-full rounded-2xl border border-foreground/[0.07] bg-background p-8 transition-all duration-400 group-hover:border-primary/30 group-hover:-translate-y-1.5 group-hover:shadow-[0_24px_48px_-16px_rgba(37,99,235,0.1)] overflow-hidden">

                  {/* Top accent on hover */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />

                  {/* Tutor header */}
                  <div className="flex items-center gap-5 mb-7">
                    <div className={`h-16 w-16 rounded-xl overflow-hidden shrink-0 border border-foreground/[0.07] group-hover:border-primary/30 transition-colors ${color.bg}`}>
                      {tutor.user?.image ? (
                        <img
                          src={tutor.user.image}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`flex h-full w-full items-center justify-center font-head text-lg ${color.text}`}>
                          {initials}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300 truncate">
                        {name}
                      </h3>
                      <p className="text-sm text-foreground/45 font-medium mt-0.5 truncate">
                        {tutor.headline || "Educator"}
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-foreground/55 leading-relaxed line-clamp-3 mb-8 flex-1 italic">
                    &quot;{tutor.bio || "Passionate about helping students achieve their goals through personalized tutoring."}&quot;
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-5 border-t border-foreground/[0.07]">
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-bold text-foreground">
                        {tutor.ratingAvg?.toFixed(1) || "5.0"}
                      </span>
                      {tutor.reviewCount != null && (
                        <span className="text-xs text-foreground/35 font-medium">
                          ({tutor.reviewCount})
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold tracking-tight text-foreground">
                        ${tutor.hourlyRate || "25"}
                      </span>
                      <span className="text-xs font-medium text-foreground/40">/hr</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}