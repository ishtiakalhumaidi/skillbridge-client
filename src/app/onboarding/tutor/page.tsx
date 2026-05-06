import React from "react"
import { OnboardingForm } from "@/app/(dashboards)/tutor/onboarding/OnboardingForm"
import { Logo } from "@/components/shared/Logo"

export default function TutorOnboardingPage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-6 bg-background transition-colors duration-700">
      <div className="w-full max-w-xl bg-foreground/5 border border-foreground/10 rounded-3xl p-8 md:p-12 relative shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">

        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <div className="text-center space-y-3 mb-10 border-b border-foreground/10 pb-10">
          <div className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary px-4 py-1.5 text-xs tracking-widest uppercase font-bold mb-4">
            Step 1 of 1
          </div>
          <h1 className="text-4xl md:text-5xl font-head tracking-tighter text-foreground leading-tight">
            Complete your profile.
          </h1>
          <p className="font-medium text-lg text-foreground/60 leading-relaxed">
            You&apos;re almost ready to start teaching. Tell us a bit about your professional background and set your rates.
          </p>
        </div>

        <OnboardingForm />
      </div>
    </div>
  )
}