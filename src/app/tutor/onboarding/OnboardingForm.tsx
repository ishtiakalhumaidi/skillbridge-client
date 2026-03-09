"use client"

import { useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { z } from "zod"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Rocket } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { tutorsApi } from "@/lib/api"

export function OnboardingForm() {
  const router = useRouter()
  const [error, setError] = useState("")

  const form = useForm({
    defaultValues: {
      headline: "",
      bio: "",
      hourlyRate: 20,
    },
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value }) => {
      setError("")
      try {
        await tutorsApi.create({
          headline: value.headline,
          bio: value.bio,
          hourlyRate: Number(value.hourlyRate),
        })
        // Once created, send them straight to their new dashboard!
        router.push("/tutor/dashboard") 
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to create tutor profile. You might already have one!")
      }
    },
  })

  // Helper to cleanly render Zod errors
  const renderError = (errors: any) => {
    if (!errors || errors.length === 0) return null;
    const errorMessages = errors.map((err: any) => typeof err === 'string' ? err : err?.message || "Invalid input");
    return <p className="text-sm text-destructive mt-1">{errorMessages.join(", ")}</p>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-6"
    >
      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium">
          {error}
        </div>
      )}

      {/* Headline */}
      <form.Field
        name="headline"
        validators={{ onChange: z.string().min(5, { message: "Headline must be at least 5 characters" }) }}
        children={(field) => (
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Professional Headline</label>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="e.g. Expert Math Tutor & Curriculum Developer"
            />
            {renderError(field.state.meta.errors)}
          </div>
        )}
      />

      {/* Hourly Rate */}
      <form.Field
        name="hourlyRate"
        validators={{ onChange: z.coerce.number().min(5, { message: "Minimum rate is $5/hr" }).max(500, { message: "Maximum rate is $500/hr" }) }}
        children={(field) => (
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Hourly Rate ($)</label>
            <input
              type="number"
              value={field.state.value}
              onChange={(e) => field.handleChange(Number(e.target.value))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="25"
            />
            {renderError(field.state.meta.errors)}
          </div>
        )}
      />

      {/* Bio */}
      <form.Field
        name="bio"
        validators={{ onChange: z.string().min(20, { message: "Bio must be at least 20 characters long" }) }}
        children={(field) => (
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">About Me (Bio)</label>
            <Textarea
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Tell students about your qualifications, teaching style, and what they will learn..."
              className="min-h-[120px] resize-y"
            />
            {renderError(field.state.meta.errors)}
          </div>
        )}
      />

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <Button type="submit" className="w-full h-12 text-md" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Rocket className="mr-2 h-5 w-5" />
            )}
            Launch Tutor Profile
          </Button>
        )}
      />
    </form>
  )
}