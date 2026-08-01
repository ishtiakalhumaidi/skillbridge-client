import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

const stats = [
  { value: "500+", label: "Expert tutors" },
  { value: "10k+", label: "Sessions booked" },
  { value: "4.9★", label: "Avg. rating" },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-background transition-colors duration-500">

      {/* ── LEFT PANEL ── */}
      <div className="relative hidden lg:flex w-[45%] xl:w-1/2 flex-col justify-between overflow-hidden border-r border-foreground/[0.07] bg-foreground/[0.025] p-14 xl:p-16">

        {/* Radial glows */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute -top-1/4 -left-1/4 w-3/4 h-3/4 rounded-full bg-primary/[0.08] blur-[120px]" />
          <div className="absolute -bottom-1/4 -right-1/4 w-3/4 h-3/4 rounded-full bg-foreground/[0.04] blur-[120px]" />
        </div>

        {/* Grid texture */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(to right,currentColor 1px,transparent 1px),linear-gradient(to bottom,currentColor 1px,transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <Logo />
        </div>

        {/* Main copy */}
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="h-px w-8 bg-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">SkillBridge</span>
          </div>
          <h2 className="text-5xl xl:text-6xl font-head tracking-tighter text-foreground leading-[0.92]">
            Master your craft.<br />
            <span className="text-foreground/25">Zero limits.</span>
          </h2>
          <p className="text-base font-medium text-foreground/50 max-w-sm leading-relaxed">
            Join an elite community of learners and mentors dedicated to absolute excellence.
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-8 pt-4">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <p className="text-xl font-bold tracking-tight text-foreground">{value}</p>
                <p className="text-xs font-medium text-foreground/40 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom brand mark */}
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            {/* Mini bridge SVG */}
            <svg width="20" height="12" viewBox="0 0 40 24" fill="none" className="text-foreground/20">
              <path d="M2 22 Q2 4 20 2 Q38 4 38 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="2" y1="22" x2="38" y2="22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <span className="text-xs font-medium text-foreground/25">Trusted by learners worldwide</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="relative flex flex-1 flex-col items-center justify-center p-6 md:p-12">

        {/* Mobile back link */}
        <Link
          href="/"
          className="absolute top-6 left-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/40 hover:text-foreground transition-colors lg:hidden group"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Home
        </Link>

        {/* Mobile logo */}
        <div className="lg:hidden mb-10">
          <Logo />
        </div>

        <div className="w-full max-w-[400px]">
          {children}
        </div>
      </div>
    </div>
  );
}