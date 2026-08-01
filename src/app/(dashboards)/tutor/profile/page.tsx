/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { ProfileForm } from "./ProfileForm";
import { TutorSubjectsManager } from "./TutorSubjectsManager";

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories?limit=100`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.data?.categories ?? [];
  } catch { return []; }
}

async function getMyTutorProfile() {
  try {
    const cookieStore = await cookies();
    const sessionRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/get-session`, {
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    });
    if (!sessionRes.ok) return null;

    const session = await sessionRes.json();
    const userId = session?.user?.id;
    if (!userId) return null;

    const tutorRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tutors?search=${session.user.name}`,
      { cache: "no-store" }
    );
    if (!tutorRes.ok) return null;

    const tutorData = await tutorRes.json();
    return tutorData?.data?.tutors?.find((t: any) => t.userId === userId) ?? null;
  } catch { return null; }
}

export default async function TutorProfilePage() {
  const [categories, myProfile] = await Promise.all([
    getCategories(),
    getMyTutorProfile(),
  ]);

  return (
    <div className="w-full max-w-5xl space-y-10">

      {/* Page header */}
      <div className="pb-6 border-b border-foreground/[0.07]">
        <div className="flex items-center gap-3 mb-3">
          <span className="h-px w-8 bg-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Profile</span>
        </div>
        <h1 className="text-4xl font-head tracking-tighter text-foreground leading-[0.9]">
          Profile Settings.
        </h1>
        <p className="text-sm font-medium text-foreground/50 mt-2">
          Manage how your public profile appears to students.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* About You */}
        <div className="rounded-2xl border border-foreground/[0.07] bg-background p-6 md:p-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="h-px w-6 bg-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">About</span>
          </div>
          <h2 className="text-2xl font-head tracking-tighter text-foreground leading-[0.9] mb-1">
            About You.
          </h2>
          <p className="text-xs font-medium text-foreground/45 mb-7">
            This information is displayed publicly on your tutor card.
          </p>
          <ProfileForm initialData={myProfile} />
        </div>

        {/* Subjects */}
        <div className="rounded-2xl border border-foreground/[0.07] bg-background p-6 md:p-8 h-fit">
          <div className="flex items-center gap-3 mb-2">
            <span className="h-px w-6 bg-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Subjects</span>
          </div>
          <h2 className="text-2xl font-head tracking-tighter text-foreground leading-[0.9] mb-1">
            Curriculum.
          </h2>
          <p className="text-xs font-medium text-foreground/45 mb-7">
            Select the categories and subjects you teach.
          </p>
          <TutorSubjectsManager
            allCategories={categories}
            initialTutorSubjects={myProfile?.subjects ?? []}
          />
        </div>
      </div>
    </div>
  );
}