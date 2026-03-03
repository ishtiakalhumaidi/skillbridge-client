import { ProfileSetupForm } from "@/src/components/modules/tutor/profile-setup-form";

export default function TutorDashboard() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tutor Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage your teaching schedule and profile.</p>
      </div>

      <div className="grid gap-6">
       
        <ProfileSetupForm />
      </div>
    </div>
  );
}