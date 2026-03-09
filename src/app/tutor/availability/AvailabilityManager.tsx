"use client"

import { useState } from "react"
import { useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { z } from "zod"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { Loader2, Trash2, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { availabilityApi } from "@/lib/api"

// Helper to convert simple time "14:30" to a valid Date string for the backend
const createDateFromTime = (timeStr: string) => {
  return new Date(`1970-01-01T${timeStr}:00Z`).toISOString();
}

// Helper to extract just the time for displaying in the UI
const formatTimeFromDateStr = (dateStr: string) => {
  try {
    return format(new Date(dateStr), "h:mm a");
  } catch (e) {
    return dateStr;
  }
}

export function AvailabilityManager({ initialSlots }: { initialSlots: any[] }) {
  const router = useRouter()
  const [slots, setSlots] = useState(initialSlots)
  const [error, setError] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      day: "Monday",
      startTime: "09:00",
      endTime: "10:00",
    },
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value }) => {
      setError("")
      try {
        const backendData = {
          day: value.day,
          startTime: createDateFromTime(value.startTime),
          endTime: createDateFromTime(value.endTime),
        }
        
        await availabilityApi.create(backendData)
        router.refresh() // Refresh server data
        window.location.reload() // Quick refresh to sync state
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to create slot")
      }
    },
  })

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id)
      await availabilityApi.delete(id)
      setSlots(slots.filter(s => s.id !== id))
    } catch (err: any) {
      setError(err.response?.data?.message || "Cannot delete a booked slot.")
    } finally {
      setDeletingId(null)
    }
  }

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  return (
    <div className="space-y-8">
      {/* Form to Add New Slot */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4">Add Time Slot</h3>
        
        {error && (
          <div className="mb-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="flex flex-col md:flex-row gap-4 items-end"
        >
          <form.Field
            name="day"
            children={(field) => (
              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium">Day of Week</label>
                <select
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}
                </select>
              </div>
            )}
          />

          <form.Field
            name="startTime"
            children={(field) => (
              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium">Start Time</label>
                <input
                  type="time"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            )}
          />

          <form.Field
            name="endTime"
            children={(field) => (
              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium">End Time</label>
                <input
                  type="time"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            )}
          />

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit || isSubmitting} className="h-10">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Slot
              </Button>
            )}
          />
        </form>
      </div>

      {/* List of Existing Slots */}
      <div>
        <h3 className="text-lg font-bold mb-4">Your Active Slots</h3>
        {slots.length === 0 ? (
          <div className="text-center py-12 border rounded-lg border-dashed">
            <p className="text-muted-foreground">You haven't added any availability yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {slots.map((slot) => (
              <div key={slot.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-md">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{slot.day}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {formatTimeFromDateStr(slot.startTime)} - {formatTimeFromDateStr(slot.endTime)}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(slot.id)}
                  disabled={slot.isBooked || deletingId === slot.id}
                >
                  {deletingId === slot.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}