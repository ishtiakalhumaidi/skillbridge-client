/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { Star, Clock, MessageSquare, ArrowLeft, ArrowRight, GraduationCap } from "lucide-react";
import { notFound } from "next/navigation";

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

export default async function TutorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tutor = await getTutor(id);
  if (!tutor) notFound();

  const user = tutor.user || {};
  const palette = avatarPalette(user.name);
  const rating = tutor.ratingAvg?.toFixed(1) ?? "5.0";
  const reviewCount = tutor.reviews?.length ?? 0;

  return (
    <div className="bg-background min-h-screen transition-colors duration-500">

      {/* ── Thin top accent ── */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="container mx-auto px-5 md:px-10 max-w-7xl py-12 md:py-20">

        {/* Back link */}
        <Link
          href="/tutors"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/40 hover:text-foreground transition-colors mb-12 group"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to Directory
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 items-start">

          {/* ── LEFT SIDEBAR ── */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="lg:sticky lg:top-24 rounded-2xl border border-foreground/[0.07] bg-foreground/[0.02] overflow-hidden">

              {/* Avatar block */}
              <div className="flex flex-col items-center text-center px-8 pt-10 pb-8 border-b border-foreground/[0.07]">
                <div
                  className="h-24 w-24 md:h-28 md:w-28 rounded-2xl overflow-hidden mb-5 border border-foreground/[0.08]"
                  style={{ background: palette.bg }}
                >
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center font-head text-3xl font-bold"
                      style={{ color: palette.color }}
                    >
                      {user.name?.substring(0, 2).toUpperCase() || "TU"}
                    </div>
                  )}
                </div>

                <h1 className="text-2xl md:text-3xl font-head tracking-tight text-foreground mb-1">
                  {user.name}
                </h1>
                <div className="flex items-center gap-1.5 text-foreground/45">
                  <GraduationCap className="h-3.5 w-3.5" />
                  <p className="text-sm font-medium">{tutor.headline || "Educator"}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 divide-x divide-foreground/[0.07] border-b border-foreground/[0.07]">
                <div className="flex flex-col items-center py-5 gap-1">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-lg font-bold text-foreground">{rating}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/35">
                    Rating
                  </span>
                </div>
                <div className="flex flex-col items-center py-5 gap-1">
                  <span className="text-lg font-bold text-foreground">
                    ${tutor.hourlyRate ?? 25}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/35">
                    Per Hour
                  </span>
                </div>
              </div>

              {/* Reviews count */}
              {reviewCount > 0 && (
                <div className="flex items-center justify-center gap-1.5 py-4 border-b border-foreground/[0.07]">
                  <MessageSquare className="h-3.5 w-3.5 text-foreground/30" />
                  <span className="text-xs font-semibold text-foreground/45">
                    {reviewCount} review{reviewCount !== 1 ? "s" : ""}
                  </span>
                </div>
              )}

              {/* CTA */}
              <div className="p-5">
                <Link href={`/tutors/${tutor.id}/book`}>
                  <div className="group w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-foreground text-background text-sm font-bold transition-all duration-300 hover:bg-primary hover:shadow-[0_8px_24px_rgba(37,99,235,0.3)] active:scale-95">
                    Book a Session
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
                <p className="text-center text-[10px] text-foreground/30 font-medium mt-3">
                  Free cancellation · Instant confirmation
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT CONTENT ── */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-0">

            {/* About */}
            <section className="pb-14 border-b border-foreground/[0.07]">
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-8 bg-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">About</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-head tracking-tighter text-foreground mb-6 leading-[0.9]">
                The Mentor.
              </h2>
              <p className="text-base md:text-lg text-foreground/60 leading-relaxed font-medium whitespace-pre-wrap">
                {tutor.bio || (
                  <span className="italic text-foreground/35">
                    This tutor hasn&apos;t written a bio yet.
                  </span>
                )}
              </p>
            </section>

            {/* Expertise */}
            <section className="py-14 border-b border-foreground/[0.07]">
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-8 bg-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Expertise</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-head tracking-tighter text-foreground mb-8 leading-[0.9]">
                Subjects.
              </h2>
              {tutor.subjects?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {tutor.subjects.map((sub: any) => (
                    <span
                      key={sub.categoryId}
                      className="inline-flex items-center rounded-full border border-foreground/[0.1] bg-foreground/[0.03] px-5 py-2 text-sm font-semibold text-foreground/65 transition-all hover:border-primary/30 hover:bg-primary/[0.05] hover:text-primary"
                    >
                      {sub.category?.name || "Subject"}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm italic text-foreground/35 font-medium">
                  No subjects listed yet.
                </p>
              )}
            </section>

            {/* Reviews */}
            <section className="pt-14">
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-8 bg-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Reviews</span>
              </div>
              <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
                <h2 className="text-4xl md:text-5xl font-head tracking-tighter text-foreground leading-[0.9]">
                  Feedback.
                </h2>
                {reviewCount > 0 && (
                  <div className="flex items-center gap-2 pb-1">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.round(tutor.ratingAvg ?? 5) ? "text-amber-400 fill-amber-400" : "text-foreground/15"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-foreground/60">
                      {rating} · {reviewCount} review{reviewCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>

              {tutor.reviews && tutor.reviews.length > 0 ? (
                <div className="space-y-0">
                  {tutor.reviews.map((review: any, i: number) => {
                    const rPalette = avatarPalette(review.student?.name ?? "");
                    return (
                      <div
                        key={review.id}
                        className={`py-8 ${i !== tutor.reviews.length - 1 ? "border-b border-foreground/[0.07]" : ""}`}
                      >
                        {/* Reviewer */}
                        <div className="flex items-center gap-3 mb-4">
                          <div
                            className="h-9 w-9 rounded-lg overflow-hidden shrink-0 border border-foreground/[0.07] flex items-center justify-center text-xs font-bold"
                            style={{ background: rPalette.bg, color: rPalette.color }}
                          >
                            {review.student?.name?.substring(0, 2).toUpperCase() || "ST"}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-foreground truncate">
                              {review.student?.name || "Anonymous"}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${i < (review.rating ?? 5) ? "text-amber-400 fill-amber-400" : "text-foreground/15"}`}
                                  />
                                ))}
                              </div>
                              <span className="text-[10px] font-semibold text-foreground/35 uppercase tracking-wider">
                                {new Date(review.createdAt).toLocaleDateString("en-US", {
                                  month: "short", day: "numeric", year: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {review.comment && (
                          <p className="text-base text-foreground/60 leading-relaxed font-medium pl-12 italic">
                            &ldquo;{review.comment}&rdquo;
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-foreground/[0.07] bg-foreground/[0.02]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-foreground/[0.07] bg-foreground/[0.04] mb-4">
                    <MessageSquare className="h-5 w-5 text-foreground/30" />
                  </div>
                  <p className="text-base font-bold text-foreground mb-1">No reviews yet.</p>
                  <p className="text-sm text-foreground/45 font-medium">
                    Be the first to book a session and leave a review!
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}