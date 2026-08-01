"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HeroSearch } from "@/components/shared/HeroSearch";

const subjects = [
  "Mathematics", "Computer Science", "Physics",
  "Languages", "Business", "Design", "Chemistry", "Music",
];

export function HeroSection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      ref={ref}
      className="w-full relative flex flex-col items-center justify-center pt-36 pb-0 md:pt-44 px-6 text-center overflow-hidden"
    >
      {/* Subtle background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Soft radial glow behind headline */}
      <div
        className="pointer-events-none absolute top-24 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(ellipse, #2563EB 0%, transparent 70%)" }}
      />

      {/* Badge */}
      <div
        className="transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(12px)",
          transitionDelay: "0ms",
        }}
      >
        <div className="inline-flex items-center gap-3 rounded-full border border-foreground/8 bg-foreground/[0.04] px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-foreground/60 mb-12 hover:border-primary/30 hover:text-foreground/80 transition-colors cursor-default">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          The new standard for learning
        </div>
      </div>

      {/* Headline */}
      <div
        className="transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transitionDelay: "100ms",
        }}
      >
        <h1 className="text-[clamp(3rem,10vw,7.5rem)] font-head tracking-tighter leading-[0.88] max-w-5xl mb-8 text-foreground">
          Master your craft.{" "}
          <br className="hidden md:block" />
          <span className="text-foreground/20">Zero limits.</span>
        </h1>
      </div>

      {/* Subtitle */}
      <div
        className="transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transitionDelay: "200ms",
        }}
      >
        <p className="text-lg md:text-xl font-medium text-foreground/50 max-w-xl mb-14 leading-relaxed">
          Connect with vetted experts for 1-on-1 mentorship that actually moves the needle.
        </p>
      </div>

      {/* Search */}
      <div
        className="w-full max-w-2xl mx-auto mb-28 relative z-10 transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transitionDelay: "300ms",
        }}
      >
        <HeroSearch />
      </div>

      {/* Marquee */}
      <div
        className="w-full border-t border-foreground/[0.07] py-7 overflow-hidden flex whitespace-nowrap relative transition-opacity duration-1000"
        style={{ opacity: visible ? 1 : 0, transitionDelay: "500ms" }}
      >
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10" style={{ background: "linear-gradient(to right, var(--background, white), transparent)" }} />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10" style={{ background: "linear-gradient(to left, var(--background, white), transparent)" }} />

        <div
          className="flex gap-14 items-center"
          style={{ animation: "marquee 28s linear infinite" }}
        >
          {[...subjects, ...subjects, ...subjects].map((s, i) => (
            <span
              key={i}
              className="font-head uppercase tracking-[0.15em] text-base text-foreground/25 hover:text-foreground/60 transition-colors cursor-default select-none"
            >
              {s}
              <span className="ml-14 inline-block h-1 w-1 rounded-full bg-foreground/20 align-middle" />
            </span>
          ))}
        </div>

        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-33.333%); }
          }
        `}</style>
      </div>
    </section>
  );
}