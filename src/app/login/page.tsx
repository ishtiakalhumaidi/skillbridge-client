"use client"

import { useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { z } from "zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { signIn } from "@/lib/auth-client"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState("")

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value }) => {
      setError("")
      
      const { data, error: authError } = await signIn.email({
        email: value.email,
        password: value.password,
      });

      if (authError) {
        setError(authError.message || "Invalid email or password")
        return;
      }
      
      // Strict Uppercase Check based on Better Auth / Prisma Enum
      const userRole = data?.user?.role;
      
      if (userRole === "TUTOR") {
        router.push("/tutor/dashboard") 
      } else if (userRole === "ADMIN") {
        router.push("/admin")
      } else {
        router.push("/dashboard/bookings") 
      }
      
      router.refresh(); // Force a refresh so the Navbar immediately catches the new cookie
    },
  })

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 bg-muted/10">
      <div className="w-full max-w-md space-y-8 rounded-xl border bg-card p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
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
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="name@example.com"
                />
                {field.state.meta.errors ? <p className="text-sm text-destructive">{field.state.meta.errors.map(e => typeof e === 'string' ? e : e.message).join(", ")}</p> : null}
              </div>
            )}
          />

          <form.Field
            name="password"
            validators={{ onChange: z.string().min(1, "Password is required") }}
            children={(field) => (
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Password</label>
                <input
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="••••••••"
                />
                {field.state.meta.errors ? <p className="text-sm text-destructive">{field.state.meta.errors.map(e => typeof e === 'string' ? e : e.message).join(", ")}</p> : null}
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
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            )}
          />
        </form>

        <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}