/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { Star, Clock, MessageSquare, ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

async function getTutor(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tutors/${id}`, { cache: "no-store" });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Failed to fetch tutor");
    }
    const responseData = await res.json();
    return responseData?.data;
  } catch (error) {
    return null;
  }
}

export default async function TutorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const tutor = await getTutor(resolvedParams.id);

  if (!tutor) notFound();

  const user = tutor.user || {};

  return (
    <div className="bg-background min-h-screen py-24 transition-colors duration-700">
      <div className="container mx-auto px-6 max-w-7xl">
        
        <Link href="/tutors" className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/50 hover:text-foreground transition-colors mb-16 uppercase tracking-widest">
          <ArrowLeft className="h-4 w-4" /> Back to Directory
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* LEFT COLUMN: Floating Minimalist Sidebar */}
          <div className="lg:col-span-4 sticky top-32">
            <div className="rounded-3xl border border-foreground/10 bg-foreground/5 p-8 flex flex-col items-center text-center">
              
              <div className="h-40 w-40 rounded-full border border-foreground/10 bg-background overflow-hidden mb-8 shadow-sm">
                {user.image ? (
                  <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-head text-5xl text-foreground/30">
                    {user.name?.substring(0, 2).toUpperCase() || "TU"}
                  </div>
                )}
              </div>
              
              <h1 className="text-4xl font-head tracking-tight text-foreground mb-2">
                {user.name}
              </h1>
              <p className="text-base font-medium text-foreground/60 mb-8">
                {tutor.headline || "Educator"}
              </p>
              
              <div className="w-full space-y-4 border-t border-foreground/10 pt-8 mb-8">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold uppercase tracking-widest text-foreground/50 flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary fill-primary" /> Rating
                  </span>
                  <span className="text-lg font-bold text-foreground">{tutor.ratingAvg?.toFixed(1) || "5.0"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold uppercase tracking-widest text-foreground/50 flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Rate
                  </span>
                  <span className="text-lg font-bold text-foreground">${tutor.hourlyRate || 25}/hr</span>
                </div>
              </div>

              <Link href={`/tutors/${tutor.id}/book`} className="w-full">
                <div className="w-full h-14 inline-flex items-center justify-center rounded-full bg-foreground text-background text-sm font-bold transition-all hover:scale-105 active:scale-95 hover:bg-primary hover:text-primary-foreground shadow-lg">
                  Book Session
                </div>
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN: Info & Reviews (Massive Typography) */}
          <div className="lg:col-span-8 space-y-24 pt-8">
            
            <section>
              <h2 className="text-5xl font-head tracking-tighter text-foreground mb-8">The Mentor.</h2>
              <p className="text-xl text-foreground/70 leading-relaxed font-medium whitespace-pre-wrap">
                {tutor.bio || <span className="italic text-foreground/40">This tutor hasn&apos;t written a bio yet.</span>}
              </p>
              
              <div className="mt-16 pt-12 border-t border-foreground/10">
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/50 mb-6">Expertise</h3>
                <div className="flex flex-wrap gap-3">
                  {tutor.subjects?.length > 0 ? (
                    tutor.subjects.map((sub: any) => (
                      <div key={sub.categoryId} className="rounded-full border border-foreground/20 px-5 py-2 text-sm font-bold text-foreground/80">
                        {sub.category?.name || "Subject"}
                      </div>
                    ))
                  ) : (
                    <p className="italic text-sm text-foreground/40 font-medium">No subjects listed.</p>
                  )}
                </div>
              </div>
            </section>

            <section className="pt-12 border-t border-foreground/10">
              <h2 className="text-5xl font-head tracking-tighter text-foreground mb-12">Feedback.</h2>
              
              {tutor.reviews && tutor.reviews.length > 0 ? (
                <div className="space-y-12">
                  {tutor.reviews.map((review: any) => (
                    <div key={review.id} className="pb-12 border-b border-foreground/10 last:border-0 last:pb-0">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="h-12 w-12 rounded-full bg-foreground/10 text-foreground flex items-center justify-center font-bold text-sm">
                           {review.student?.name?.substring(0, 2).toUpperCase() || "ST"}
                        </div>
                        <div>
                          <p className="font-bold text-lg text-foreground">{review.student?.name || "Anonymous"}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`h-3.5 w-3.5 ${i < (review.rating || 5) ? "text-primary fill-primary" : "text-foreground/20"}`} />
                              ))}
                            </div>
                            <span className="text-xs font-semibold text-foreground/40 uppercase tracking-widest">
                              • {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {review.comment && (
                        <p className="text-lg text-foreground/70 leading-relaxed font-medium">
                          &quot;{review.comment}&quot;
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center bg-foreground/5 rounded-3xl border border-foreground/10">
                  <MessageSquare className="h-8 w-8 text-foreground/30 mb-4" />
                  <p className="text-xl font-bold text-foreground">No feedback yet.</p>
                  <p className="text-base text-foreground/60 mt-2 font-medium">Be the first to book a session and leave a review!</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}