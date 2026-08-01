import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, Clock, GraduationCap } from "lucide-react";
import { BookingForm } from "./BookingForm";

async function getTutor(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tutors/${id}`, { cache: "no-store" });
    if (!res.ok) { if (res.status === 404) return null; throw new Error(); }
    const data = await res.json();
    return data?.data ?? null;
  } catch { return null; }
}

function avatarPalette(name = "") {
  const p = [
    { bg: "#EFF6FF", color: "#1D4ED8" },
    { bg: "#F0FDFA", color: "#0F766E" },
    { bg: "#F5F3FF", color: "#6D28D9" },
    { bg: "#FFF7ED", color: "#C2410C" },
    { bg: "#F0FDF4", color: "#15803D" },
  ];
  return p[(name.charCodeAt(0) || 0) % p.length];
}

export default async function BookTutorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tutor = await getTutor(id);
  if (!tutor) notFound();

  const user = tutor.user || {};
  const palette = avatarPalette(user.name);

  return (
    <div className="bg-background min-h-screen transition-colors duration-500">

      {/* Thin top accent */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="container mx-auto px-5 md:px-10 max-w-6xl py-12 md:py-20">

        {/* Back */}
        <Link
          href={`/tutors/${tutor.id}`}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/40 hover:text-foreground transition-colors mb-12 group"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to Profile
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">

          {/* ── LEFT: Tutor summary card ── */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 rounded-2xl border border-foreground/[0.07] bg-foreground/[0.02] overflow-hidden">

              {/* Header */}
              <div className="px-6 pt-6 pb-5 border-b border-foreground/[0.07]">
                <div className="flex items-center gap-4">
                  <div
                    className="h-14 w-14 rounded-xl overflow-hidden shrink-0 border border-foreground/[0.07]"
                    style={{ background: palette.bg }}
                  >
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div
                        className="flex h-full w-full items-center justify-center font-head text-base font-bold"
                        style={{ color: palette.color }}
                      >
                        {user.name?.substring(0, 2).toUpperCase() || "TU"}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base font-bold tracking-tight text-foreground truncate">
                      {user.name || "Tutor"}
                    </h2>
                    <div className="flex items-center gap-1.5 mt-1 text-foreground/45">
                      <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                      <span className="text-xs font-medium truncate">{tutor.headline || "Educator"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 divide-x divide-foreground/[0.07] border-b border-foreground/[0.07]">
                <div className="flex flex-col items-center py-4 gap-0.5">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-bold text-foreground">
                      {tutor.ratingAvg?.toFixed(1) ?? "5.0"}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/30">Rating</span>
                </div>
                <div className="flex flex-col items-center py-4 gap-0.5">
                  <span className="text-sm font-bold text-foreground">
                    ${tutor.hourlyRate ?? 25}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/30">Per Hour</span>
                </div>
              </div>

              {/* What's included */}
              <div className="p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 mb-3">
                  What you get
                </p>
                <ul className="space-y-2.5">
                  {[
                    "1-on-1 live session",
                    "Personalised lesson plan",
                    "Session recording (if enabled)",
                    "Follow-up resources",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-xs font-medium text-foreground/55">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/50 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Reassurance */}
              <div className="mx-5 mb-5 rounded-xl bg-primary/[0.05] border border-primary/[0.1] px-4 py-3">
                <p className="text-[11px] font-semibold text-primary/70 leading-relaxed">
                  No charge until the tutor confirms · Free cancellation anytime
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Booking form ── */}
          <div className="lg:col-span-8">
            {/* Page heading */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-8 bg-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Book a session</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-head tracking-tighter text-foreground leading-[0.9] mb-3">
                Reserve your time.
              </h1>
              <p className="text-sm text-foreground/50 font-medium">
                Choose a subject, pick a date, and select your preferred time slot.
              </p>
            </div>

            {/* Form card */}
            <div className="rounded-2xl border border-foreground/[0.07] bg-background px-6 md:px-8 py-6">
              <BookingForm tutor={tutor} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}