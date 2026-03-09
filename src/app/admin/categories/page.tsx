import { cookies } from "next/headers"
import { CategoryManager } from "./CategoryManager"

async function getCategories() {
  try {
    const cookieStore = await cookies();
    
    // Using limit=100 just to fetch a large list for the admin view without complex pagination logic right now
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories?limit=100`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });
    
    if (!res.ok) return [];
    
    const responseData = await res.json();
    
 
    return responseData?.data?.categories || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Categories</h1>
        <p className="text-muted-foreground mt-1">
          Add or edit subject categories that tutors can assign to their profiles.
        </p>
      </div>

      <CategoryManager initialCategories={categories} />
    </div>
  )
}