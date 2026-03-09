"use client"

import { useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { z } from "zod"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { bookingsApi } from "@/lib/api"

export function BookingForm({ tutor }: { tutor: any }) {
  const router = useRouter()
  const [error, setError] = useState("")
  const [mounted, setMounted] = useState(false)

 
  useEffect(() => {
    setMounted(true)
  }, [])

  const form = useForm({
    defaultValues: {
      categoryId: "",
      availabilityId: "",
      date: new Date(),
    },
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value }) => {
      setError("")
      try {
        await bookingsApi.create({
          categoryId: value.categoryId,
          availabilityId: value.availabilityId,
          date: value.date.toISOString(),
        })
        router.push("/dashboard/bookings") 
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to book session. Please try again.")
      }
    },
  })

  // Helper to safely render Zod errors instead of [object Object]
  const renderError = (errors: any) => {
    if (!errors || errors.length === 0) return null;
    const errorMessages = errors.map((err: any) => typeof err === 'string' ? err : err?.message || "Invalid input");
    return <p className="text-sm text-destructive">{errorMessages.join(", ")}</p>;
  }

  if (!mounted) return null; // Wait for hydration

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
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Subject Selection */}
      <form.Field
        name="categoryId"
        validators={{ onChange: z.string().min(1, { message: "Please select a subject" }) }}
        children={(field) => (
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Select Subject</label>
            <select
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="" disabled>Choose a subject...</option>
              {tutor.subjects?.map((subject: any) => (
                <option key={subject.categoryId} value={subject.categoryId}>
                  {subject.category?.name || "Subject"}
                </option>
              ))}
            </select>
            {renderError(field.state.meta.errors)}
          </div>
        )}
      />

      {/* Date Picker */}
      <form.Field
        name="date"
        children={(field) => (
          <div className="space-y-2 flex flex-col">
            <label className="text-sm font-medium leading-none">Select Date</label>
            <Popover>
              {/* 💡 FIX: Removed asChild and the inner <Button>. Styled directly! */}
              <PopoverTrigger
                className={cn(
                  "inline-flex shrink-0 items-center rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                  "w-full justify-start text-left font-normal h-10",
                  !field.state.value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.state.value ? format(field.state.value, "PPP") : <span>Pick a date</span>}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.state.value}
                  onSelect={(date) => date && field.handleChange(date)}
                  initialFocus
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))} // Disable past dates
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      />

      {/* Time Slot Selection */}
      <form.Field
        name="availabilityId"
        validators={{ onChange: z.string().min(1, { message: "Please select an available time slot" }) }}
        children={(field) => (
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Select Time Slot</label>
            <select
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="" disabled>Choose a time slot...</option>
              {tutor.availability?.length > 0 ? (
                tutor.availability.map((slot: any) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.day} • {slot.startTime} - {slot.endTime}
                  </option>
                ))
              ) : (
                <option value="" disabled>No slots available</option>
              )}
            </select>
            {renderError(field.state.meta.errors)}
          </div>
        )}
      />

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <Button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="w-full font-medium h-12"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Booking
          </Button>
        )}
      />
    </form>
  )
}