"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function useScrollReveal(threshold = 0.1) {
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

// Decorative SVG icons per category (fallback cycling)
const categoryIcons = [
  // Math
  <svg key="math" width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M4 11h14M11 4v14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="5.5" cy="5.5" r="1.5" fill="currentColor" opacity=".4"/><circle cx="16.5" cy="16.5" r="1.5" fill="currentColor" opacity=".4"/></svg>,
  // Code
  <svg key="code" width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M7 7L2 11l5 4M15 7l5 4-5 4M12 5l-2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  // Science
  <svg key="sci" width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M8 3v7L3 18h16L14 10V3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 3h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="13" cy="15" r="1.5" fill="currentColor" opacity=".5"/></svg>,
  // Language
  <svg key="lang" width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M2 5h12M8 5v3M4 8c0 3 4 5 6 5M10 8c-1 2-3 4-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 14l2-5 2 5M13 12.5h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  // Business
  <svg key="biz" width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="2" y="9" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M7 9V7a4 4 0 018 0v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M11 14v-2M8 13h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  // Design
  <svg key="design" width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.8"/><circle cx="11" cy="11" r="3" fill="currentColor" opacity=".25"/><path d="M11 2v4M11 16v4M2 11h4M16 11h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity=".4"/></svg>,
  // Music
  <svg key="music" width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M9 17V6l10-2v11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="6" cy="17" r="3" stroke="currentColor" strokeWidth="1.8"/><circle cx="16" cy="15" r="3" stroke="currentColor" strokeWidth="1.8"/></svg>,
  // History
  <svg key="hist" width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M11 7v4l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
];

export function PopularCategories({ categories }: { categories: any[] }) {
  const { ref, revealed } = useScrollReveal();

  if (!categories || !Array.isArray(categories) || categories.length === 0) return null;

  return (
    <section className="w-full py-32 border-t border-foreground/[0.07]">
      <div className="container mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-10 bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Subjects</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-head tracking-tighter mb-4 text-foreground leading-[0.9]">
              Top Subjects.
            </h2>
            <p className="text-lg text-foreground/50 font-medium">
              Find the exact category you need to level up.
            </p>
          </div>
          <Link
            href="/tutors"
            className="group flex items-center gap-2 h-12 rounded-full border border-foreground/15 px-7 text-sm font-semibold text-foreground/70 transition-all duration-300 hover:border-primary hover:text-primary hover:bg-primary/5 active:scale-95 whitespace-nowrap"
          >
            View all subjects
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Grid */}
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat: any, i: number) => (
            <Link
              key={cat.id}
              href={`/tutors?categoryId=${cat.id}`}
              className="group outline-none"
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.6s ease ${i * 60}ms, transform 0.6s ease ${i * 60}ms`,
              }}
            >
              <div className="relative flex flex-col justify-between h-44 p-7 rounded-2xl border border-foreground/[0.07] bg-foreground/[0.02] overflow-hidden transition-all duration-400 group-hover:border-primary/40 group-hover:bg-primary/[0.04] group-hover:-translate-y-1 group-hover:shadow-[0_16px_48px_-12px_rgba(37,99,235,0.12)]">

                {/* Icon top-left */}
                <div className="text-foreground/25 group-hover:text-primary/60 transition-colors duration-300">
                  {categoryIcons[i % categoryIcons.length]}
                </div>

                {/* Arrow top-right */}
                <div className="absolute top-6 right-6 text-foreground/15 group-hover:text-primary/50 transition-all duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="h-5 w-5" />
                </div>

                {/* Category name */}
                <div>
                  <h3 className="font-head text-xl text-foreground/80 group-hover:text-foreground transition-colors duration-300 line-clamp-2 leading-tight tracking-tight">
                    {cat.name}
                  </h3>
                  {cat._count?.sessions != null && (
                    <p className="text-xs text-foreground/30 mt-1.5 font-medium">
                      {cat._count.sessions} sessions
                    </p>
                  )}
                </div>

                {/* Animated bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary to-primary/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}