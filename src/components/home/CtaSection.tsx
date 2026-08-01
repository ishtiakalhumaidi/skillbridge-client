"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function CtaSection() {
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setRevealed(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="w-full py-32 border-t border-foreground/[0.07]"
    >
      <div className="container mx-auto px-5 md:px-10">
        <div
          className="relative rounded-3xl border border-foreground/[0.07] bg-foreground/[0.025] overflow-hidden px-8 py-20 md:px-20 text-center transition-all duration-700"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0)" : "translateY(24px)",
          }}
        >
          {/* Subtle radial accent */}
          <div
            className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-[0.07]"
            style={{ background: "radial-gradient(ellipse, #2563EB 0%, transparent 70%)" }}
          />

          {/* Grid texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage:
                "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative z-10 max-w-2xl mx-auto">
            {/* Label */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className="h-px w-8 bg-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Start today
              </span>
              <span className="h-px w-8 bg-primary" />
            </div>

            <h2 className="text-4xl md:text-6xl font-head tracking-tighter leading-[0.9] text-foreground mb-6">
              Ready to bridge the gap?
            </h2>

            <p className="text-base md:text-lg text-foreground/50 font-medium leading-relaxed mb-12 max-w-lg mx-auto">
              Join thousands of learners who are already leveling up with SkillBridge mentors.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="group flex items-center gap-2 h-13 rounded-full bg-foreground px-8 py-3.5 text-sm font-bold text-background transition-all duration-300 hover:bg-primary hover:shadow-[0_8px_24px_rgba(37,99,235,0.35)] active:scale-95"
              >
                Get started — it&apos;s free
                {/* Custom bridge-pencil mini SVG */}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>

              <Link
                href="/tutors"
                className="flex items-center gap-2 h-13 rounded-full border border-foreground/[0.12] px-8 py-3.5 text-sm font-semibold text-foreground/65 transition-all duration-300 hover:border-foreground/25 hover:text-foreground active:scale-95"
              >
                Browse tutors
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12">
              {[
                { value: "500+", label: "Expert tutors" },
                { value: "10k+", label: "Sessions booked" },
                { value: "4.9★", label: "Average rating" },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col items-center">
                  <span className="text-xl font-bold tracking-tight text-foreground">{value}</span>
                  <span className="text-xs font-medium text-foreground/40 mt-0.5">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}