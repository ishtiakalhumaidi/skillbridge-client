/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-children-prop */
"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, Clock, Plus } from "lucide-react";
import { availabilityApi } from "@/lib/api";

const createDateFromTime = (timeStr: string) => new Date(`1970-01-01T${timeStr}:00Z`).toISOString();
const formatTimeFromDateStr = (dateStr: string) => {
  try { return format(new Date(dateStr), "h:mm a"); } catch (e) { return dateStr; }
};

export function AvailabilityManager({ initialSlots }: { initialSlots: any[] }) {
  const router = useRouter();
  const [slots, setSlots] = useState(initialSlots);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { day: "Monday", startTime: "09:00", endTime: "10:00" },
    onSubmit: async ({ value }) => {
      setError("");
      try {
        const backendData = {
          day: value.day,
          startTime: createDateFromTime(value.startTime),
          endTime: createDateFromTime(value.endTime),
        };
        await availabilityApi.create(backendData);
        router.refresh();
        window.location.reload(); 
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to create slot");
      }
    },
  });

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await availabilityApi.delete(id);
      setSlots(slots.filter((s) => s.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Cannot delete a booked slot.");
    } finally {
      setDeletingId(null);
    }
  };

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Form to Add New Slot */}
      <div className="rounded-3xl border border-foreground/10 bg-foreground/5 p-8 md:p-10 shadow-sm">
        <h3 className="text-2xl font-head tracking-tighter text-foreground mb-8">Add Time Slot</h3>
        
        {error && (
          <div className="mb-8 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-bold text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }} className="flex flex-col md:flex-row gap-6 items-end">
          <form.Field
            name="day"
            children={(field) => (
              <div className="space-y-3 flex-1 w-full">
                <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70">Day of Week</label>
                <select
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full rounded-2xl border border-foreground/20 bg-background px-5 py-4 text-base font-semibold text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/20 hover:border-foreground/40 appearance-none cursor-pointer"
                >
                  {daysOfWeek.map((day) => <option key={day} value={day}>{day}</option>)}
                </select>
              </div>
            )}
          />
          <form.Field
            name="startTime"
            children={(field) => (
              <div className="space-y-3 flex-1 w-full">
                <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70">Start Time</label>
                <input
                  type="time"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full rounded-2xl border border-foreground/20 bg-background px-5 py-4 text-base font-semibold text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/20 hover:border-foreground/40"
                />
              </div>
            )}
          />
          <form.Field
            name="endTime"
            children={(field) => (
              <div className="space-y-3 flex-1 w-full">
                <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70">End Time</label>
                <input
                  type="time"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full rounded-2xl border border-foreground/20 bg-background px-5 py-4 text-base font-semibold text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/20 hover:border-foreground/40"
                />
              </div>
            )}
          />
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="group flex h-[58px] w-full md:w-auto items-center justify-center gap-2 rounded-2xl bg-foreground px-8 font-bold text-background transition-all hover:bg-primary hover:text-primary-foreground active:scale-[0.98] disabled:opacity-30 disabled:hover:scale-100"
              >
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
                Add Slot
              </button>
            )}
          />
        </form>
      </div>

      {/* List of Existing Slots */}
      <div>
        <h3 className="text-3xl font-head tracking-tighter text-foreground mb-8">Active Slots</h3>
        
        {slots.length === 0 ? (
          <div className="text-center py-24 rounded-3xl border border-foreground/10 bg-background shadow-sm">
            <Clock className="h-12 w-12 text-foreground/20 mx-auto mb-4" />
            <p className="text-xl font-bold text-foreground">No availability set.</p>
            <p className="text-foreground/60 font-medium mt-2">Add your first time slot above so students can book you.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slots.map((slot) => (
              <div key={slot.id} className="group flex items-center justify-between p-6 rounded-3xl border border-foreground/10 bg-background hover:border-primary hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground/5 text-foreground/50 group-hover:text-primary transition-colors">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-foreground">{slot.day}</p>
                    <p className="text-sm font-semibold text-foreground/50 mt-0.5">
                      {formatTimeFromDateStr(slot.startTime)} - {formatTimeFromDateStr(slot.endTime)}
                    </p>
                  </div>
                </div>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full text-foreground/40 hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-30"
                  onClick={() => handleDelete(slot.id)}
                  disabled={slot.isBooked || deletingId === slot.id}
                  title={slot.isBooked ? "Cannot delete booked slot" : "Delete slot"}
                >
                  {deletingId === slot.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}