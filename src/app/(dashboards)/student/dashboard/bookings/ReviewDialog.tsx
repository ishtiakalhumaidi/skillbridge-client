/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-children-prop */
"use client"

import { useState } from "react"
import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { Loader2, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { reviewsApi } from "@/lib/api"

export function ReviewDialog({ bookingId, tutorName }: { bookingId: string; tutorName: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const form = useForm({
    defaultValues: { rating: 5, comment: "" },
    onSubmit: async ({ value }) => {
      try {
        await reviewsApi.create({
          bookingId,
          rating: Number(value.rating),
          comment: value.comment || undefined,
        })
        setIsOpen(false)
        toast.success("Review submitted! Thank you.")
        router.refresh() 
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to submit review.")
      }
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open ? setIsOpen(false) : setIsOpen(true)}>
      <DialogTrigger className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-foreground px-5 text-sm font-bold text-background transition-all hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95 shadow-md">
        <Star className="h-4 w-4" /> Leave Review
      </DialogTrigger>
      
      <DialogContent className="border border-foreground/10 rounded-3xl shadow-2xl bg-background sm:max-w-md p-8">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-head tracking-tighter text-foreground">Session Review</DialogTitle>
          <DialogDescription className="text-sm font-medium text-foreground/60 mt-1">
            How was your learning experience with <span className="font-bold text-foreground">{tutorName}</span>?
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }} className="space-y-6">
          
          <form.Field
            name="rating"
            validators={{ onChange: z.coerce.number().min(1).max(5) }}
            children={(field) => (
              <div className="space-y-3">
                <label className="block font-bold text-xs uppercase tracking-widest text-foreground/70">Rating</label>
                <select
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  className="w-full rounded-2xl border border-foreground/20 bg-transparent px-5 py-4 text-base font-semibold text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/20 appearance-none cursor-pointer"
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

          <form.Field
            name="comment"
            children={(field) => (
              <div className="space-y-3">
                <label className="block font-bold text-xs uppercase tracking-widest text-foreground/70">Feedback (Optional)</label>
                <textarea
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Share your thoughts about this tutoring session..."
                  className="w-full min-h-[120px] resize-y rounded-2xl border border-foreground/20 bg-transparent px-5 py-4 text-base font-medium text-foreground outline-none transition-all placeholder:text-foreground/30 focus:border-primary focus:ring-4 focus:ring-primary/20"
                />
              </div>
            )}
          />

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={() => setIsOpen(false)} className="rounded-full px-6 py-3 text-sm font-bold text-foreground/60 transition-colors hover:bg-foreground/5 hover:text-foreground">
              Cancel
            </button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <button type="submit" disabled={!canSubmit || isSubmitting} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-8 text-sm font-bold text-background transition-all hover:bg-primary hover:text-primary-foreground active:scale-95 disabled:opacity-30">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit
                </button>
              )}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}