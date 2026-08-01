/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-children-prop */
"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import {
  format, startOfMonth, endOfMonth,
  eachDayOfInterval, getDay, addMonths,
} from "date-fns";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, CalendarClock, Plus, AlertCircle } from "lucide-react";
import { availabilityApi } from "@/lib/api";

const selectClass =
  "w-full rounded-xl border border-foreground/[0.1] bg-foreground/[0.02] px-4 py-3 text-sm font-medium text-foreground outline-none transition-all duration-200 focus:border-primary/50 focus:bg-background focus:ring-4 focus:ring-primary/[0.08] hover:border-foreground/20 appearance-none cursor-pointer";

const timeClass =
  "w-full rounded-xl border border-foreground/[0.1] bg-foreground/[0.02] px-4 py-3 text-sm font-medium text-foreground outline-none transition-all duration-200 focus:border-primary/50 focus:bg-background focus:ring-4 focus:ring-primary/[0.08] hover:border-foreground/20";

const dayNameToNumber: Record<string, number> = {
  Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
  Thursday: 4, Friday: 5, Saturday: 6,
};

const getUpcomingMonths = () => {
  const today = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const d = addMonths(today, i);
    return { value: format(d, "yyyy-MM"), label: format(d, "MMMM yyyy") };
  });
};

const formatTimeFromDateStr = (dateStr: string) => {
  try { return format(new Date(dateStr), "h:mm a"); } catch { return dateStr; }
};

function avatarPalette(day: string) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const palettes = [
    { bg: "#EFF6FF", color: "#1D4ED8" },
    { bg: "#F0FDFA", color: "#0F766E" },
    { bg: "#F5F3FF", color: "#6D28D9" },
    { bg: "#FFF7ED", color: "#C2410C" },
    { bg: "#F0FDF4", color: "#15803D" },
    { bg: "#FDF4FF", color: "#7E22CE" },
    { bg: "#FFF1F2", color: "#BE123C" },
  ];
  const idx = days.findIndex((d) => day.startsWith(d));
  return palettes[idx >= 0 ? idx : 0];
}

export function AvailabilityManager({ initialSlots }: { initialSlots: any[] }) {
  const router = useRouter();
  const [slots, setSlots] = useState(initialSlots);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const upcomingMonths = getUpcomingMonths();
  const daysOfWeek = Object.keys(dayNameToNumber);

  const form = useForm({
    defaultValues: {
      month: upcomingMonths[0].value,
      day: "Monday",
      startTime: "09:00",
      endTime: "10:00",
    },
    onSubmit: async ({ value }) => {
      setError("");
      try {
        const [yearStr, monthStr] = value.month.split("-");
        const monthStart = startOfMonth(new Date(parseInt(yearStr), parseInt(monthStr) - 1));
        const monthEnd = endOfMonth(monthStart);
        const targetDay = dayNameToNumber[value.day];

        const matchingDates = eachDayOfInterval({ start: monthStart, end: monthEnd })
          .filter((d) => getDay(d) === targetDay)
          .map((d) => format(d, "yyyy-MM-dd"));

        if (matchingDates.length === 0) { setError("No matching days found in this month."); return; }

        await availabilityApi.createBulk({
          dates: matchingDates,
          startTime: value.startTime,
          endTime: value.endTime,
        });

        router.refresh();
        window.location.reload();
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to generate slots.");
      }
    },
  });

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await availabilityApi.delete(id);
      setSlots((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete slot.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-12">

      {/* ── Generate form ── */}
      <div className="rounded-2xl border border-foreground/[0.07] bg-foreground/[0.02] p-6 md:p-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="h-px w-8 bg-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Generate</span>
          </div>
          <h3 className="text-2xl font-head tracking-tighter text-foreground leading-[0.9]">
            Monthly Slots
          </h3>
          <p className="text-sm font-medium text-foreground/45 mt-1.5">
            Pick a month and day of the week to bulk-generate all matching slots.
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/[0.06] px-4 py-3 mb-5">
            <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
            <p className="text-xs font-bold text-destructive">{error}</p>
          </div>
        )}

        <form
          onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 items-end"
        >
          {/* Month */}
          <form.Field
            name="month"
            children={(field) => (
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">
                  Target Month
                </label>
                <select
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={selectClass}
                >
                  {upcomingMonths.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
            )}
          />

          {/* Day */}
          <form.Field
            name="day"
            children={(field) => (
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">
                  Day of Week
                </label>
                <select
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={selectClass}
                >
                  {daysOfWeek.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
            )}
          />

          {/* Start time */}
          <form.Field
            name="startTime"
            children={(field) => (
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">
                  Start Time
                </label>
                <input
                  type="time"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={timeClass}
                />
              </div>
            )}
          />

          {/* End time */}
          <form.Field
            name="endTime"
            children={(field) => (
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">
                  End Time
                </label>
                <input
                  type="time"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={timeClass}
                />
              </div>
            )}
          />

          {/* Submit — full width on small, auto on xl */}
          <div className="sm:col-span-2 xl:col-span-4 flex justify-end">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="group flex h-10 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-foreground px-6 text-sm font-bold text-background transition-all duration-300 hover:bg-primary hover:shadow-[0_8px_24px_rgba(37,99,235,0.3)] active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Generating…</>
                  ) : (
                    <><Plus className="h-4 w-4" /> Generate Slots</>
                  )}
                </button>
              )}
            />
          </div>
        </form>
      </div>

      {/* ── Existing slots ── */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <span className="h-px w-8 bg-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Active Slots</span>
        </div>
        <h3 className="text-3xl font-head tracking-tighter text-foreground leading-[0.9] mb-6">
          Your Schedule.
        </h3>

        {slots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-foreground/[0.07] bg-foreground/[0.02]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-foreground/[0.07] bg-foreground/[0.04] mb-4">
              <CalendarClock className="h-5 w-5 text-foreground/30" />
            </div>
            <p className="text-base font-bold text-foreground mb-1">No upcoming slots</p>
            <p className="text-sm font-medium text-foreground/40 max-w-xs">
              Generate your schedule above so students can book sessions with you.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {slots.map((slot) => {
              const dayName = format(new Date(slot.date), "EEEE");
              const palette = avatarPalette(dayName.substring(0, 3));

              return (
                <div
                  key={slot.id}
                  className="group flex items-center justify-between p-4 rounded-2xl border border-foreground/[0.07] bg-background transition-all duration-300 hover:border-primary/20 hover:shadow-[0_4px_16px_-4px_rgba(37,99,235,0.08)]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Date block */}
                    <div
                      className="flex flex-col items-center justify-center h-12 w-12 rounded-xl shrink-0 border border-foreground/[0.07]"
                      style={{ background: palette.bg }}
                    >
                      <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: palette.color, opacity: 0.7 }}>
                        {format(new Date(slot.date), "MMM")}
                      </span>
                      <span className="text-lg font-head tracking-tighter leading-none" style={{ color: palette.color }}>
                        {format(new Date(slot.date), "dd")}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{dayName}</p>
                      <p className="text-xs font-medium text-foreground/45 mt-0.5">
                        {formatTimeFromDateStr(slot.startTime)} – {formatTimeFromDateStr(slot.endTime)}
                      </p>
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(slot.id)}
                    disabled={deletingId === slot.id}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-foreground/30 transition-all hover:bg-destructive/[0.08] hover:text-destructive disabled:opacity-30"
                    aria-label="Delete slot"
                  >
                    {deletingId === slot.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}