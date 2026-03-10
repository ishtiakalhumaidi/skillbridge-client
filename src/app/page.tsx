import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedTutors } from "@/components/home/FeaturedTutors";
import { HowItWorks } from "@/components/home/HowItWorks";
import { PopularCategories } from "@/components/home/PopularCategories";


async function getFeaturedTutors() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tutors?isFeatured=true&limit=3`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const responseData = await res.json();
    return responseData?.data?.tutors || [];
  } catch (error) {
    console.error("Failed to fetch tutors", error);
    return [];
  }
}

async function getPopularCategories() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories?limit=8`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const responseData = await res.json();
    return responseData?.data?.categories || [];
  } catch (error) {
    console.error("Failed to fetch categories", error);
    return [];
  }
}


export default async function Home() {

  const [featuredTutors, categories] = await Promise.all([
    getFeaturedTutors(),
    getPopularCategories(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturedTutors tutors={featuredTutors} />
      <HowItWorks />
      <PopularCategories categories={categories} />
    </div>
  );
}