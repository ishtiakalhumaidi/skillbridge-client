"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    id: "01",
    title: "Discover.",
    description:
      "Search by subject, review verified profiles, and find the perfect mentor tailored to your learning style.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M18 18L24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "02",
    title: "Schedule.",
    description:
      "View live availability and instantly lock in a time slot that seamlessly fits your calendar.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="5" width="22" height="20" rx="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3 11H25" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 3V7M19 3V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="14" cy="18" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "03",
    title: "Master.",
    description:
      "Connect in a secure environment, achieve your goals, and leave feedback for the community.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 22L10 16M10 16L14 20L24 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setRevealed(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, revealed };
}

export function HowItWorks() {
  const { ref, revealed } = useScrollReveal();

  return (
    <section
      id="how-it-works"
      className="w-full py-32 border-t border-foreground/[0.07]"
      style={{ background: "var(--color-subtle-bg, rgba(0,0,0,0.015))" }}
    >
      <div className="container mx-auto px-6 md:px-12">

        {/* Section label */}
        <div
          className="flex items-center gap-3 mb-10 transition-all duration-700"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0)" : "translateY(16px)",
          }}
        >
          <span className="h-px flex-1 max-w-[40px] bg-primary" />
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            How it works
          </span>
        </div>

        <h2
          className="text-5xl md:text-7xl font-head tracking-tighter mb-24 text-foreground transition-all duration-700"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "80ms",
          }}
        >
          Simplicity<br className="hidden md:block" /> by design.
        </h2>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-0 max-w-6xl mx-auto">
          {steps.map((step, i) => (
            <div
              key={step.id}
              className="group relative flex flex-col border-t border-foreground/[0.07] md:border-t-0 md:border-l first:border-t-0 first:border-l-0 px-0 md:px-12 pt-12 md:pt-0 first:pl-0 transition-all duration-700"
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? "translateY(0)" : "translateY(32px)",
                transitionDelay: `${i * 120 + 160}ms`,
              }}
            >
              {/* Step number */}
              <div className="text-[7rem] md:text-[9rem] font-head tracking-tighter leading-none text-foreground/[0.06] mb-6 transition-colors duration-500 group-hover:text-primary/[0.12] select-none">
                {step.id}
              </div>

              {/* Icon */}
              <div className="mb-5 text-foreground/30 group-hover:text-primary transition-colors duration-300">
                {step.icon}
              </div>

              <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                {step.title}
              </h3>

              <p className="text-base text-foreground/55 leading-relaxed font-medium max-w-xs">
                {step.description}
              </p>

              {/* Hover accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}