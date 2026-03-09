"use client"

import { useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { z } from "zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { signUp } from "@/lib/auth-client"

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState("")

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "STUDENT", // 💡 Strict Uppercase Default
    },
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value }) => {
      setError("")
      
      const { data, error: authError } = await signUp.email({
        email: value.email,
        password: value.password,
        name: value.name,
        role: value.role, 
      });

      if (authError) {
        setError(authError.message || "An error occurred during registration")
        return;
      }
      
      const userRole = data?.user?.role || value.role;
      
      // Route new tutors to the onboarding flow!
      if (userRole === "TUTOR") {
        router.push("/onboarding/tutor")
      } else if (userRole === "ADMIN") {
        router.push("/admin")
      } else {
        router.push("/dashboard/bookings")
      }

      router.refresh();
    },
  })

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 bg-muted/10">
      <div className="w-full max-w-md space-y-8 rounded-xl border bg-card p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">Join SkillBridge to connect with experts</p>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium">
            {error}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-6"
        >
          <form.Field
            name="name"
            validators={{ onChange: z.string().min(2, "Name must be at least 2 characters") }}
            children={(field) => (
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Full Name</label>
                <input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="John Doe"
                />
                {field.state.meta.errors ? <p className="text-sm text-destructive">{field.state.meta.errors.map(e => typeof e === 'string' ? e : e.message).join(", ")}</p> : null}
              </div>
            )}
          />

          <form.Field
            name="email"
            validators={{ onChange: z.string().email("Please enter a valid email address") }}
            children={(field) => (
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Email</label>
                <input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="name@example.com"
                />
                {field.state.meta.errors ? <p className="text-sm text-destructive">{field.state.meta.errors.map(e => typeof e === 'string' ? e : e.message).join(", ")}</p> : null}
              </div>
            )}
          />

          <form.Field
            name="password"
            validators={{ onChange: z.string().min(8, "Password must be at least 8 characters") }}
            children={(field) => (
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Password</label>
                <input
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="••••••••"
                />
                {field.state.meta.errors ? <p className="text-sm text-destructive">{field.state.meta.errors.map(e => typeof e === 'string' ? e : e.message).join(", ")}</p> : null}
              </div>
            )}
          />

          <form.Field
            name="role"
            children={(field) => (
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">I want to...</label>
                <select
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="STUDENT">Learn as a Student</option>
                  <option value="TUTOR">Teach as a Tutor</option>
                </select>
              </div>
            )}
          />

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 h-10"
              >
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isSubmitting ? "Creating account..." : "Sign up"}
              </button>
            )}
          />
        </form>

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  )
}