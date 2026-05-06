/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { Star, GraduationCap, X, ArrowRight, ArrowLeft, Search } from "lucide-react";

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories?limit=50`, { cache: "no-store" });
    if (!res.ok) return [];
    const responseData = await res.json();
    return responseData?.data?.categories || [];
  } catch (error) {
    return [];
  }
}

async function getTutors(searchQuery?: string, categoryId?: string, page: number = 1) {
  try {
    let fetchUrl = `${process.env.NEXT_PUBLIC_API_URL}/tutors?limit=6&page=${page}`;
    if (searchQuery) fetchUrl += `&search=${encodeURIComponent(searchQuery)}`;
    if (categoryId) fetchUrl += `&categoryId=${categoryId}`;
    
    const res = await fetch(fetchUrl, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch tutors");
    
    const responseData = await res.json();
    return responseData?.data || { tutors: [], pagination: null };
  } catch (error) {
    return { tutors: [], pagination: null };
  }
}

export default async function TutorsPage({ searchParams }: { searchParams: Promise<{ search?: string; categoryId?: string; page?: string }> }) {
  const resolvedParams = await searchParams;
  const currentSearch = resolvedParams.search;
  const currentCategory = resolvedParams.categoryId;
  const currentPage = resolvedParams.page ? parseInt(resolvedParams.page) : 1;

  const [{ tutors, pagination }, categories] = await Promise.all([
    getTutors(currentSearch, currentCategory, currentPage),
    getCategories(),
  ]);

  const buildFilterUrl = (categoryId?: string, pageOverride?: number) => {
    const params = new URLSearchParams();
    if (currentSearch) params.set("search", currentSearch);
    if (categoryId) params.set("categoryId", categoryId);
    if (pageOverride && pageOverride > 1) params.set("page", pageOverride.toString());
    return `/tutors?${params.toString()}`;
  };

  return (
    <div className="bg-background min-h-screen pb-32 transition-colors duration-700">
      
      {/* Magazine-Style Header */}
      <div className="pt-32 pb-16 px-6 border-b border-foreground/10 bg-foreground/5">
        <div className="container mx-auto max-w-7xl flex flex-col space-y-6">
          <h1 className="text-6xl md:text-8xl font-head tracking-tighter text-foreground leading-[0.9]">
            {currentSearch ? `Results for &quot;${currentSearch}&quot;` : "Find your mentor."}
          </h1>
          <p className="text-xl md:text-2xl font-medium text-foreground/60 max-w-2xl">
            Browse our verified professionals and book your next learning session instantly.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl pt-16">
        
        {/* Minimalist Filter Pills */}
        {Array.isArray(categories) && categories.length > 0 && (
          <div className="mb-16 flex flex-wrap items-center gap-3">
            {(currentCategory || currentSearch) && (
              <Link href="/tutors" className="flex items-center gap-1.5 rounded-full bg-foreground/10 text-foreground px-5 py-2.5 text-sm font-semibold hover:bg-foreground/20 transition-colors">
                <X className="h-4 w-4" /> Clear Filters
              </Link>
            )}
            
            <Link href={buildFilterUrl(undefined, 1)}>
              <div className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all cursor-pointer border ${!currentCategory ? "bg-foreground text-background border-foreground" : "bg-transparent text-foreground/60 border-foreground/20 hover:border-foreground/40 hover:text-foreground"}`}>
                All Subjects
              </div>
            </Link>
            {categories.map((cat: any) => (
              <Link key={cat.id} href={buildFilterUrl(cat.id, 1)}>
                <div className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all cursor-pointer border ${currentCategory === cat.id ? "bg-foreground text-background border-foreground" : "bg-transparent text-foreground/60 border-foreground/20 hover:border-foreground/40 hover:text-foreground"}`}>
                  {cat.name}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Tutors Grid */}
        {!Array.isArray(tutors) || tutors.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-32 rounded-3xl border border-foreground/10 bg-foreground/5 shadow-sm">
            <Search className="h-16 w-16 text-foreground/20 mb-6" />
            <h3 className="text-3xl font-head tracking-tight text-foreground mb-4">No tutors found</h3>
            <p className="text-lg text-foreground/60 max-w-md">
              We couldn&apos;t find any tutors matching your current filters. Try selecting a different subject or clearing your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {tutors.map((tutor: any) => (
              <Link key={tutor.id} href={`/tutors/${tutor.id}`} className="group flex flex-col rounded-3xl bg-background border border-foreground/10 hover:border-primary transition-all duration-500 overflow-hidden hover:-translate-y-2">
                <div className="flex flex-row items-center gap-6 p-8 border-b border-foreground/10 bg-foreground/5">
                  <div className="h-20 w-20 rounded-full border border-foreground/10 bg-background overflow-hidden shrink-0">
                    {tutor.user?.image ? (
                      <img src={tutor.user.image} alt={tutor.user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-head text-2xl text-foreground/40">
                        {tutor.user?.name?.substring(0, 2).toUpperCase() || "TU"}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <h3 className="text-2xl font-bold tracking-tight text-foreground truncate group-hover:text-primary transition-colors">{tutor.user?.name || "Tutor Name"}</h3>
                    <div className="flex items-center space-x-1.5 mt-2">
                      <Star className="h-4 w-4 text-primary fill-primary" />
                      <span className="text-sm font-bold text-foreground/80">{tutor.ratingAvg?.toFixed(1) || "5.0"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-8 flex flex-col">
                  <div className="flex items-center space-x-2 text-sm font-semibold text-foreground/60 bg-foreground/5 px-4 py-1.5 rounded-full w-fit mb-6 border border-foreground/5">
                    <GraduationCap className="h-4 w-4" />
                    <span className="truncate max-w-[200px]">{tutor.headline || "Educator"}</span>
                  </div>
                  <p className="text-base text-foreground/70 leading-relaxed line-clamp-3 mb-8 flex-1 font-medium">
                    &quot;{tutor.bio || "Passionate about helping students achieve their goals through personalized sessions."}&quot;
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {(tutor.subjects || []).slice(0, 3).map((subject: any, idx: number) => (
                      <span key={idx} className="text-xs font-bold text-foreground/50 uppercase tracking-widest border border-foreground/10 px-3 py-1 rounded-full">
                        {subject.category?.name || subject.name || "Subject"}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-foreground/10 bg-foreground/5 p-6">
                  <div className="flex flex-col text-left">
                    <span className="text-2xl font-bold tracking-tight text-foreground">
                      ${tutor.hourlyRate || "25"}<span className="text-sm text-foreground/50 font-medium">/hr</span>
                    </span>
                  </div>
                  <div className="inline-flex items-center justify-center rounded-full bg-foreground text-background px-6 py-3 text-sm font-bold transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                    View Profile
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Minimalist Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 mt-24">
            <Link 
              href={currentPage > 1 ? buildFilterUrl(currentCategory, currentPage - 1) : "#"}
              className={currentPage <= 1 ? "pointer-events-none opacity-30" : ""}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-foreground/20 text-foreground transition-all hover:bg-foreground/5 hover:border-foreground">
                <ArrowLeft className="h-5 w-5" />
              </div>
            </Link>
            
            <div className="text-sm font-bold text-foreground/60 tracking-widest uppercase">
              Page <span className="text-foreground">{currentPage}</span> of {pagination.totalPages}
            </div>
            
            <Link 
              href={currentPage < pagination.totalPages ? buildFilterUrl(currentCategory, currentPage + 1) : "#"}
              className={currentPage >= pagination.totalPages ? "pointer-events-none opacity-30" : ""}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-foreground/20 text-foreground transition-all hover:bg-foreground/5 hover:border-foreground">
                <ArrowRight className="h-5 w-5" />
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}