import { Suspense } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedTutors } from "@/components/home/FeaturedTutors";
import { HowItWorks } from "@/components/home/HowItWorks";
import { PopularCategories } from "@/components/home/PopularCategories";
import { CtaSection } from "@/components/home/CtaSection";

// Import our new 3D Client Boundary
import { LandingBookCanvas } from "@/components/3d/LandingBookCanvas"; 

async function getFeaturedTutors() {
  // ... existing fetch logic
}

async function getPopularCategories() {
  // ... existing fetch logic
}

export default async function Home() {
  const [featuredTutors, categories] = await Promise.all([
    getFeaturedTutors(),
    getPopularCategories(),
  ]);

  return (
    // The Canvas wrapper takes over the viewport
    <LandingBookCanvas>
      {/* Page 1 */}
      <section className="w-screen h-screen">
        <HeroSection />
      </section>

      {/* Page 2 */}
      <section className="w-screen h-screen">
        <Suspense fallback={<SectionSkeleton />}>
          <FeaturedTutors tutors={featuredTutors} />
        </Suspense>
      </section>

      {/* Page 3 */}
      <section className="w-screen h-screen">
        <HowItWorks />
      </section>

      {/* Page 4 */}
      <section className="w-screen h-screen">
        <Suspense fallback={<SectionSkeleton />}>
          <PopularCategories categories={categories} />
        </Suspense>
      </section>

      {/* Page 5 */}
      <section className="w-screen h-screen">
        <CtaSection />
      </section>
    </LandingBookCanvas>
  );
}
function SectionSkeleton() {
  return (
    <div className="w-full py-32 border-t border-foreground/[0.07]">
      <div className="container mx-auto px-5 md:px-10">
        <div className="h-12 w-56 rounded-xl bg-foreground/[0.05] mb-8 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-foreground/[0.04] animate-pulse"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}