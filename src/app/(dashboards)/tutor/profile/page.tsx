/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers"
import { ProfileForm } from "./ProfileForm"
import { TutorSubjectsManager } from "./TutorSubjectsManager"

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories?limit=100`, { cache: "no-store" });
    if (!res.ok) return [];
    const responseData = await res.json();
    return responseData?.data?.categories || [];
  } catch (error) {
    return [];
  }
}

async function getMyTutorProfile() {
  try {
    const cookieStore = await cookies();
    const sessionRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/get-session`, {
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    });
    
    if (!sessionRes.ok) return null;
    
    const sessionData = await sessionRes.json();
    const userId = sessionData?.user?.id;
    
    if (!userId) return null;
    
    const tutorRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tutors?search=${sessionData.user.name}`, { cache: "no-store" });
    if (!tutorRes.ok) return null;
    
    const tutorData = await tutorRes.json();
    const myProfile = tutorData?.data?.tutors?.find((t: any) => t.userId === userId);
    
    return myProfile || null;
  } catch (error) {
    return null;
  }
}

export default async function TutorProfilePage() {
  const categories = await getCategories();
  const myProfile = await getMyTutorProfile();

  return (
    <div className="space-y-12 w-full max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="border-b border-foreground/10 pb-6">
        <h1 className="text-4xl font-head tracking-tighter text-foreground">Profile Settings.</h1>
        <p className="text-lg font-medium text-foreground/60 mt-2">
          Manage how your public profile appears to students.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left Column: Basic Info */}
        <div className="rounded-3xl border border-foreground/10 bg-background p-8 md:p-10 shadow-sm">
          <h2 className="text-2xl font-head tracking-tighter text-foreground mb-2">About You.</h2>
          <p className="text-sm font-medium text-foreground/60 mb-8">This information is displayed publicly on your tutor card.</p>
          <ProfileForm initialData={myProfile} />
        </div>

        {/* Right Column: Subjects Management */}
        <div className="rounded-3xl border border-foreground/10 bg-background p-8 md:p-10 shadow-sm h-fit">
          <h2 className="text-2xl font-head tracking-tighter text-foreground mb-2">Curriculum.</h2>
          <p className="text-sm font-medium text-foreground/60 mb-8">Select the specific categories and subjects you teach.</p>
          <TutorSubjectsManager 
            allCategories={categories} 
            initialTutorSubjects={myProfile?.subjects || []} 
          />
        </div>
      </div>
    </div>
  );
}