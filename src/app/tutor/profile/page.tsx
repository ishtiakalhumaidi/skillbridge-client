import { cookies } from "next/headers"
import { ProfileForm } from "./ProfileForm"
import { TutorSubjectsManager } from "./TutorSubjectsManager"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Fetch all available platform categories
async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories?limit=100`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const responseData = await res.json();
    return responseData?.data?.categories || [];
  } catch (error) {
    return [];
  }
}

// Fetch the tutor's existing profile to grab their current subjects
async function getMyTutorProfile() {
  try {
    const cookieStore = await cookies();
    
    // We fetch the session first to get the user ID
    const sessionRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/get-session`, {
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    });
    
    if (!sessionRes.ok) return null;
    const sessionData = await sessionRes.json();
    const userId = sessionData?.user?.id;
    
    if (!userId) return null;

    // Fetch the tutor list matching this userId (to find the specific Tutor record)
    const tutorRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tutors?search=${sessionData.user.name}`, {
      cache: "no-store",
    });
    
    if (!tutorRes.ok) return null;
    const tutorData = await tutorRes.json();
    
    // Find the exact tutor profile that belongs to the logged-in user
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage how your public tutor profile appears to students.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Basic Info */}
        <Card className="border-none shadow-sm bg-card/50">
          <CardHeader>
            <CardTitle>Public Information</CardTitle>
            <CardDescription>
              This information will be displayed on your tutor card and detailed profile page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm initialData={myProfile} />
          </CardContent>
        </Card>

        {/* Right Column: Subjects Management */}
        <Card className="border-none shadow-sm bg-card/50 h-fit">
          <CardHeader>
            <CardTitle>Teaching Subjects</CardTitle>
            <CardDescription>
              Select the specific categories and subjects you are qualified to teach. Students use these to find you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TutorSubjectsManager 
              allCategories={categories} 
              initialTutorSubjects={myProfile?.subjects || []} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}