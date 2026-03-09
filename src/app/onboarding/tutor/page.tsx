import { OnboardingForm } from "@/app/tutor/onboarding/OnboardingForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TutorOnboardingPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-muted/10">
      <Card className="w-full max-w-xl border-none shadow-md">
        <CardHeader className="text-center space-y-2 pb-6">
          <CardTitle className="text-3xl font-bold tracking-tight">Complete Your Profile</CardTitle>
          <CardDescription className="text-base">
            You're almost ready to start teaching! Tell us a bit about your professional background and set your rates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OnboardingForm />
        </CardContent>
      </Card>
    </div>
  )
}