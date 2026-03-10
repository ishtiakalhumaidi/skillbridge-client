"use client"

import { useState } from "react"
import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { Loader2, Star } from "lucide-react"
import { useRouter } from "next/navigation"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { reviewsApi } from "@/lib/api"

export function ReviewDialog({ bookingId, tutorName }: { bookingId: string; tutorName: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      rating: 5,
      comment: "",
    },
    onSubmit: async ({ value }) => {
      setError("")
      try {
        await reviewsApi.create({
          bookingId,
          rating: Number(value.rating),
          comment: value.comment || undefined,
        })
        setIsOpen(false)
        router.refresh() // Refresh the server page to fetch the new state
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to submit review.")
      }
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open ? setIsOpen(false) : setIsOpen(true)}>
      {/* 💡 Safely styled trigger without the asChild bug */}
      <DialogTrigger className="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3">
        <Star className="mr-1.5 h-3 w-3 fill-amber-500 text-amber-500" />
        Leave Review
      </DialogTrigger>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review your session</DialogTitle>
          <DialogDescription>
            How was your learning experience with {tutorName}?
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-6 pt-4"
        >
          {error && <div className="text-sm text-destructive font-medium">{error}</div>}

          {/* Rating Field */}
          <form.Field
            name="rating"
            validators={{ onChange: z.coerce.number().min(1).max(5) }}
            children={(field) => (
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Rating</label>
                <select
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Very Good</option>
                  <option value={3}>3 - Good</option>
                  <option value={2}>2 - Fair</option>
                  <option value={1}>1 - Poor</option>
                </select>
              </div>
            )}
          />

          {/* Comment Field */}
          <form.Field
            name="comment"
            children={(field) => (
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Feedback (Optional)</label>
                <Textarea
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Share your thoughts about this tutoring session..."
                  className="min-h-[100px] resize-y"
                />
              </div>
            )}
          />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Review
                </Button>
              )}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}