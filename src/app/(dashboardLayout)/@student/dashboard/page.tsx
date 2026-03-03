import { tutorService } from "@/src/services/tutor.service";
import { TutorCard } from "@/src/components/modules/student/tutor-card";

export default async function StudentDashboard() {
  const { data: tutors, error } = await tutorService.getAllTutors();

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Find a Tutor</h1>
        <p className="text-muted-foreground mt-2">
          Browse our expert tutors and book a session to accelerate your learning.
        </p>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 text-red-500 rounded-md border border-red-200">
          {error.message}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutors && tutors.length > 0 ? (
            tutors.map((tutor: any) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              No tutors available at the moment. Check back later!
            </div>
          )}
        </div>
      )}
    </div>
  );
}