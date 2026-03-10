"use client"

import { useState } from "react"
import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { Loader2, UserCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession, updateUser } from "@/lib/auth-client"

export default function StudentProfilePage() {
  const { data: session, isPending } = useSession()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const form = useForm({
    defaultValues: {
      name: session?.user?.name || "",
      image: session?.user?.image || "",
    },
    onSubmit: async ({ value }) => {
      setError("")
      setSuccess(false)
      
      try {
        const { error: updateError } = await updateUser({
          name: value.name,
          image: value.image || undefined, // Better Auth accepts undefined to clear/ignore
        })

        if (updateError) {
          setError(updateError.message || "Failed to update profile.")
          return
        }

        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000) // Hide success message after 3 seconds
      } catch (err) {
        setError("An unexpected error occurred. Please try again.")
      }
    },
  })

  // Show a loading spinner while Better Auth verifies the session cookie
  if (isPending) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // If no session, they shouldn't be here (the Proxy middleware usually catches this anyway)
  if (!session) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground mt-1">
          Update your personal information and how you appear to tutors.
        </p>
      </div>

      <Card className="border-none shadow-sm bg-card/50">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            This information is shared with tutors when you book a session.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6 mb-8 pb-8 border-b">
            <Avatar className="h-20 w-20 border-2 border-primary/10">
              <AvatarImage src={session.user.image || undefined} />
              <AvatarFallback className="text-xl bg-primary/10 text-primary">
                {session.user.name?.substring(0, 2).toUpperCase() || <UserCircle className="h-10 w-10" />}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-lg">{session.user.name}</p>
              <p className="text-sm text-muted-foreground">{session.user.email}</p>
            </div>
          </div>

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
            {success && (
              <div className="rounded-md bg-green-500/15 p-3 text-sm text-green-600 dark:text-green-400 font-medium">
                Profile updated successfully!
              </div>
            )}

            <form.Field
              name="name"
              validators={{ onChange: z.string().min(2, "Name must be at least 2 characters") }}
              children={(field) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Full Name</label>
                  <input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="John Doe"
                  />
                  {field.state.meta.errors ? (
                    <p className="text-sm text-destructive">
                      {field.state.meta.errors.map(e => typeof e === 'string' ? e : e?.message).filter(Boolean).join(", ")}
                    </p>
                  ) : null}
                </div>
              )}
            />

            <form.Field
              name="image"
             validators={{ onChange: z.string().url("Must be a valid image URL").or(z.literal("")) }}
              children={(field) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Profile Image URL (Optional)</label>
                  <input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="https://example.com/avatar.jpg"
                  />
                  {field.state.meta.errors ? (
                    <p className="text-sm text-destructive">
                      {field.state.meta.errors.map(e => typeof e === 'string' ? e : e?.message).filter(Boolean).join(", ")}
                    </p>
                  ) : null}
                  <p className="text-xs text-muted-foreground">Paste a link to an image to update your avatar.</p>
                </div>
              )}
            />

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              )}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  )
}