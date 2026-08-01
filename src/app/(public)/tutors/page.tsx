/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { Star, GraduationCap, X, ArrowRight, ArrowLeft, Search } from "lucide-react";

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories?limit=50`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.data?.categories ?? [];
  } catch {
    return [];
  }
}

async function getTutors(searchQuery?: string, categoryId?: string, page: number = 1) {
  try {
    let url = `https://skillbridge-server-xi.vercel.app/api/v1/tutors?limit=6&page=${page}`;
    if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
    if (categoryId) url += `&categoryId=${categoryId}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data?.data ?? { tutors: [], pagination: null };
  } catch {
    return { tutors: [], pagination: null };
  }
}

// Deterministic avatar bg from name
function avatarStyle(name = "") {
  const palettes = [
    { bg: "#EFF6FF", color: "#1D4ED8" },
    { bg: "#F0FDFA", color: "#0F766E" },
    { bg: "#F5F3FF", color: "#6D28D9" },
    { bg: "#FFF7ED", color: "#C2410C" },
    { bg: "#F0FDF4", color: "#15803D" },
  ];
  return palettes[(name.charCodeAt(0) || 0) % palettes.length];
}

export default async function TutorsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; categoryId?: string; page?: string }>;
}) {
  const params = await searchParams;
  const currentSearch = params.search;
  const currentCategory = params.categoryId;
  const currentPage = params.page ? parseInt(params.page) : 1;

  const [{ tutors, pagination }, categories] = await Promise.all([
    getTutors(currentSearch, currentCategory, currentPage),
    getCategories(),
  ]);

  const buildUrl = (categoryId?: string, page?: number) => {
    const p = new URLSearchParams();
    if (currentSearch) p.set("search", currentSearch);
    if (categoryId) p.set("categoryId", categoryId);
    if (page && page > 1) p.set("page", page.toString());
    return `/tutors?${p.toString()}`;
  };

  const hasFilters = !!(currentCategory || currentSearch);
  const totalResults = pagination?.totalCount ?? tutors?.length ?? 0;

  return (
    <div className="bg-background min-h-screen transition-colors duration-500">

      {/* ── Page header ── */}
      <div className="border-b border-foreground/[0.07] bg-foreground/[0.02]">
        <div className="container mx-auto max-w-7xl px-5 md:px-10 pt-24 pb-14">

          {/* Label */}
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              {currentCategory
                ? (categories.find((c: any) => c.id === currentCategory)?.name ?? "Subject")
                : "All Tutors"}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-head tracking-tighter text-foreground leading-[0.9] mb-5">
            {currentSearch
              ? <>Results for <span className="text-foreground/30">&ldquo;{currentSearch}&rdquo;</span></>
              : "Find your mentor."}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-base md:text-lg font-medium text-foreground/50 max-w-xl">
              Browse verified professionals and book your next learning session instantly.
            </p>
            {totalResults > 0 && (
              <span className="text-sm font-semibold text-foreground/35 shrink-0">
                {totalResults} tutor{totalResults !== 1 ? "s" : ""} found
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-5 md:px-10 max-w-7xl pt-12 pb-32">

        {/* ── Category filter pills ── */}
        {Array.isArray(categories) && categories.length > 0 && (
          <div className="mb-12 flex flex-wrap items-center gap-2">
            {/* Clear */}
            {hasFilters && (
              <Link
                href="/tutors"
                className="flex items-center gap-1.5 rounded-full border border-foreground/[0.1] bg-foreground/[0.04] px-4 py-2 text-xs font-semibold text-foreground/60 transition-all hover:border-foreground/20 hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </Link>
            )}

            {/* All */}
            <Link href={buildUrl(undefined, 1)}>
              <span
                className={`inline-flex items-center rounded-full px-5 py-2 text-xs font-bold transition-all duration-200 border ${
                  !currentCategory
                    ? "bg-foreground text-background border-foreground"
                    : "border-foreground/[0.1] text-foreground/55 hover:border-foreground/25 hover:text-foreground"
                }`}
              >
                All Subjects
              </span>
            </Link>

            {/* Per-category */}
            {categories.map((cat: any) => (
              <Link key={cat.id} href={buildUrl(cat.id, 1)}>
                <span
                  className={`inline-flex items-center rounded-full px-5 py-2 text-xs font-bold transition-all duration-200 border ${
                    currentCategory === cat.id
                      ? "bg-foreground text-background border-foreground"
                      : "border-foreground/[0.1] text-foreground/55 hover:border-foreground/25 hover:text-foreground"
                  }`}
                >
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {(!Array.isArray(tutors) || tutors.length === 0) ? (
          <div className="flex flex-col items-center justify-center text-center py-32 rounded-2xl border border-foreground/[0.07] bg-foreground/[0.02]">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-foreground/[0.07] bg-foreground/[0.04] mb-6">
              <Search className="h-7 w-7 text-foreground/30" />
            </div>
            <h3 className="text-2xl font-head tracking-tight text-foreground mb-3">
              No tutors found
            </h3>
            <p className="text-sm text-foreground/50 max-w-sm leading-relaxed mb-8">
              We couldn&apos;t find any tutors matching your filters. Try a different subject or clear your search.
            </p>
            <Link
              href="/tutors"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/[0.1] px-6 py-2.5 text-sm font-semibold text-foreground/65 transition-all hover:border-foreground/25 hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
              Clear all filters
            </Link>
          </div>
        ) : (
          /* ── Tutor grid ── */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tutors.map((tutor: any) => {
              const name = tutor.user?.name || "Tutor";
              const initials = name.substring(0, 2).toUpperCase();
              const palette = avatarStyle(name);

              return (
                <Link
                  key={tutor.id}
                  href={`/tutors/${tutor.id}`}
                  className="group flex flex-col rounded-2xl border border-foreground/[0.07] bg-background overflow-hidden transition-all duration-400 hover:border-primary/30 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-16px_rgba(37,99,235,0.1)]"
                >
                  {/* Card top accent on hover */}
                  <div className="h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />

                  {/* Tutor identity */}
                  <div className="flex items-center gap-4 px-6 pt-6 pb-5 border-b border-foreground/[0.06]">
                    {/* Avatar */}
                    <div
                      className="h-14 w-14 rounded-xl overflow-hidden shrink-0 border border-foreground/[0.07] group-hover:border-primary/20 transition-colors"
                      style={{ background: palette.bg }}
                    >
                      {tutor.user?.image ? (
                        <img
                          src={tutor.user.image}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="flex h-full w-full items-center justify-center font-head text-base font-bold"
                          style={{ color: palette.color }}
                        >
                          {initials}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300 truncate">
                        {name}
                      </h3>
                      {/* Headline */}
                      <div className="flex items-center gap-1.5 mt-1">
                        <GraduationCap className="h-3.5 w-3.5 text-foreground/30 shrink-0" />
                        <span className="text-xs font-medium text-foreground/45 truncate">
                          {tutor.headline || "Educator"}
                        </span>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-bold text-foreground/80">
                        {tutor.ratingAvg?.toFixed(1) ?? "5.0"}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex-1 px-6 py-5 flex flex-col gap-4">
                    {/* Bio */}
                    <p className="text-sm text-foreground/55 leading-relaxed line-clamp-3 italic flex-1">
                      &ldquo;{tutor.bio || "Passionate about helping students achieve their goals through personalized sessions."}&rdquo;
                    </p>

                    {/* Subject tags */}
                    {(tutor.subjects || []).length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {(tutor.subjects as any[]).slice(0, 3).map((subject: any, idx: number) => (
                          <span
                            key={idx}
                            className="rounded-full border border-foreground/[0.08] bg-foreground/[0.03] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground/45"
                          >
                            {subject.category?.name || subject.name || "Subject"}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-foreground/[0.06] bg-foreground/[0.015] px-6 py-4">
                    <div>
                      <span className="text-xl font-bold tracking-tight text-foreground">
                        ${tutor.hourlyRate ?? "25"}
                      </span>
                      <span className="text-xs font-medium text-foreground/40 ml-0.5">/hr</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-foreground/[0.1] px-5 py-2 text-xs font-bold text-foreground/65 transition-all duration-300 group-hover:border-primary/30 group-hover:bg-primary/[0.05] group-hover:text-primary">
                      View Profile
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* ── Pagination ── */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-5 mt-20">
            <Link
              href={currentPage > 1 ? buildUrl(currentCategory, currentPage - 1) : "#"}
              aria-disabled={currentPage <= 1}
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-200 ${
                currentPage <= 1
                  ? "pointer-events-none border-foreground/[0.05] text-foreground/20"
                  : "border-foreground/[0.1] text-foreground/60 hover:border-foreground/25 hover:text-foreground hover:bg-foreground/[0.03]"
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === pagination.totalPages || Math.abs(p - currentPage) <= 1)
                .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) =>
                  p === "…" ? (
                    <span key={`ellipsis-${idx}`} className="w-9 text-center text-sm text-foreground/25 font-medium">
                      …
                    </span>
                  ) : (
                    <Link key={p} href={buildUrl(currentCategory, p as number)}>
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all duration-200 ${
                          currentPage === p
                            ? "bg-foreground text-background"
                            : "text-foreground/50 hover:bg-foreground/[0.05] hover:text-foreground"
                        }`}
                      >
                        {p}
                      </span>
                    </Link>
                  )
                )}
            </div>

            <Link
              href={currentPage < pagination.totalPages ? buildUrl(currentCategory, currentPage + 1) : "#"}
              aria-disabled={currentPage >= pagination.totalPages}
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-200 ${
                currentPage >= pagination.totalPages
                  ? "pointer-events-none border-foreground/[0.05] text-foreground/20"
                  : "border-foreground/[0.1] text-foreground/60 hover:border-foreground/25 hover:text-foreground hover:bg-foreground/[0.03]"
              }`}
            >
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}