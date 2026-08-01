/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-children-prop */
"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Loader2, Star, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { reviewsApi } from "@/lib/api";

const starLabels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

export function ReviewDialog({
  bookingId,
  tutorName,
}: {
  bookingId: string;
  tutorName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(0);
  const router = useRouter();

  const form = useForm({
    defaultValues: { rating: 5, comment: "" },
    onSubmit: async ({ value }) => {
      try {
        await reviewsApi.create({
          bookingId,
          rating: Number(value.rating),
          comment: value.comment || undefined,
        });
        setIsOpen(false);
        toast.success("Review submitted! Thank you.");
        router.refresh();
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to submit review.");
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <button className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-foreground/[0.1] bg-foreground/[0.03] px-4 text-xs font-bold text-foreground/65 transition-all duration-250 hover:border-primary/30 hover:bg-primary/[0.06] hover:text-primary active:scale-95">
          <Star className="h-3.5 w-3.5" />
          Leave Review
        </button>
      </DialogTrigger>

      <DialogContent className="border border-foreground/[0.08] rounded-2xl bg-background shadow-2xl sm:max-w-sm p-0 overflow-hidden">
        {/* Dialog header accent */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className="p-7">
          <DialogHeader className="mb-6 text-left">
            <DialogTitle className="text-2xl font-head tracking-tighter text-foreground">
              Leave a Review
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-foreground/50 mt-1">
              How was your session with{" "}
              <span className="font-bold text-foreground">{tutorName}</span>?
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="flex flex-col gap-5"
          >
            {/* Star rating */}
            <form.Field
              name="rating"
              validators={{ onChange: z.coerce.number().min(1).max(5) }}
              children={(field) => (
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = star <= (hovered || field.state.value);
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => field.handleChange(star)}
                          onMouseEnter={() => setHovered(star)}
                          onMouseLeave={() => setHovered(0)}
                          className="transition-transform duration-150 hover:scale-110 active:scale-95"
                        >
                          <Star
                            className={`h-7 w-7 transition-colors duration-150 ${
                              active
                                ? "text-amber-400 fill-amber-400"
                                : "text-foreground/15"
                            }`}
                          />
                        </button>
                      );
                    })}
                    <span className="ml-2 text-xs font-semibold text-foreground/45">
                      {starLabels[(hovered || field.state.value) - 1] ?? ""}
                    </span>
                  </div>
                </div>
              )}
            />

            {/* Comment */}
            <form.Field
              name="comment"
              children={(field) => (
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">
                    Feedback{" "}
                    <span className="normal-case tracking-normal font-medium text-foreground/30">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Share your experience…"
                    rows={3}
                    className="w-full resize-none rounded-xl border border-foreground/[0.1] bg-foreground/[0.02] px-4 py-3 text-sm font-medium text-foreground outline-none transition-all duration-200 placeholder:text-foreground/30 focus:border-primary/40 focus:bg-background focus:ring-4 focus:ring-primary/[0.07] hover:border-foreground/20"
                  />
                </div>
              )}
            />

            {/* Actions */}
            <div className="flex items-center justify-between pt-1 gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-xs font-bold text-foreground/45 transition-colors hover:text-foreground rounded-lg hover:bg-foreground/[0.04]"
              >
                Cancel
              </button>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <button
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                    className="group flex h-9 items-center justify-center gap-2 rounded-xl bg-foreground px-5 text-xs font-bold text-background transition-all duration-300 hover:bg-primary hover:shadow-[0_4px_16px_rgba(37,99,235,0.3)] active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />{" "}
                        Submitting…
                      </>
                    ) : (
                      <>
                        Submit Review{" "}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                )}
              />
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
