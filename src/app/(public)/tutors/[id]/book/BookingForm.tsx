/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-children-prop */
"use client";

import { useMemo } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { format, startOfDay } from "date-fns";
import { Loader2, ArrowRight, Clock, CalendarDays, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { bookingsApi } from "@/lib/api";

const formatTime = (dateStr: string) => {
  try { return format(new Date(dateStr), "h:mm a"); } catch { return dateStr; }
};

export function BookingForm({ tutor }: { tutor: any }) {
  const router = useRouter();

  const trulyAvailableSlots = useMemo(() => {
    const availabilities = tutor?.availability || [];
    const existingBookings = tutor?.bookings || [];
    return availabilities.filter((slot: any) => {
      const isBooked = existingBookings.some((booking: any) => {
        const sameDate = format(new Date(booking.date), "yyyy-MM-dd") === format(new Date(slot.date), "yyyy-MM-dd");
        const sameTime = new Date(booking.startTime).getTime() === new Date(slot.startTime).getTime();
        return sameDate && sameTime;
      });
      return !isBooked;
    });
  }, [tutor]);

  const availableDateStrings = useMemo(() => {
    const dates = trulyAvailableSlots.map((slot: any) => format(new Date(slot.date), "yyyy-MM-dd"));
    return new Set(dates);
  }, [trulyAvailableSlots]);

  const form = useForm({
    defaultValues: { categoryId: "", availabilityId: "", date: new Date() },
    onSubmit: async ({ value }) => {
      try {
        toast.loading("Sending request to tutor…");
        await bookingsApi.create({
          categoryId: value.categoryId,
          availabilityId: value.availabilityId,
          date: value.date.toISOString(),
        });
        toast.dismiss();
        toast.success("Session requested! Awaiting tutor confirmation.");
        router.push("/student/dashboard/bookings");
        router.refresh();
      } catch (err: any) {
        toast.dismiss();
        toast.error(err.response?.data?.message || "Failed to book session. Please try again.");
      }
    },
  });

  const renderError = (errors: any) => {
    if (!errors || errors.length === 0) return null;
    const msgs = errors.map((e: any) => (typeof e === "string" ? e : e?.message || "Invalid input"));
    return <p className="text-xs font-bold text-destructive mt-2">{msgs.join(", ")}</p>;
  };

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }}
      className="space-y-0"
    >
      {/* ── Step 1: Subject ── */}
      <form.Field
        name="categoryId"
        validators={{ onChange: z.string().min(1, { message: "Please select a subject" }) }}
        children={(field) => (
          <div className="py-8 border-b border-foreground/[0.07]">
            {/* Step label */}
            <div className="flex items-center gap-3 mb-5">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold border transition-colors duration-300 shrink-0 ${
                  field.state.value
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-foreground/20 text-foreground/40"
                }`}
              >
                {field.state.value ? <CheckCircle2 className="h-3.5 w-3.5" /> : "1"}
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-foreground/50">
                What do you want to learn?
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {tutor.subjects?.map((subject: any) => {
                const isSelected = field.state.value === subject.categoryId;
                return (
                  <button
                    key={subject.categoryId}
                    type="button"
                    onClick={() => field.handleChange(subject.categoryId)}
                    className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-250 border ${
                      isSelected
                        ? "bg-foreground text-background border-foreground shadow-sm"
                        : "border-foreground/[0.1] text-foreground/60 hover:border-foreground/25 hover:text-foreground"
                    }`}
                  >
                    {subject.category?.name || "Subject"}
                  </button>
                );
              })}
            </div>
            {renderError(field.state.meta.errors)}
          </div>
        )}
      />

      {/* ── Steps 2 & 3: Date + Time ── */}
      <div className="py-8 border-b border-foreground/[0.07]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Date picker */}
          <form.Field
            name="date"
            children={(field) => (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-foreground/20 text-[10px] font-bold text-foreground/40 shrink-0">
                    2
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-foreground/50 flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Select Date
                  </span>
                </div>
                <div className="rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-3 w-fit">
                  <Calendar
                    mode="single"
                    selected={field.state.value}
                    onSelect={(date) => {
                      if (date) {
                        field.handleChange(date);
                        form.setFieldValue("availabilityId", "");
                      }
                    }}
                    disabled={(date) => {
                      const today = startOfDay(new Date());
                      if (date < today) return true;
                      return !availableDateStrings.has(format(date, "yyyy-MM-dd"));
                    }}
                    className="bg-transparent"
                  />
                </div>
              </div>
            )}
          />

          {/* Time slots */}
          <form.Field
            name="availabilityId"
            validators={{ onChange: z.string().min(1, { message: "Please select a time slot" }) }}
            children={(field) => {
              const selectedDate = form.getFieldValue("date");
              const selectedDateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
              const slotsForDay = trulyAvailableSlots.filter(
                (slot: any) => format(new Date(slot.date), "yyyy-MM-dd") === selectedDateStr
              );

              return (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-foreground/20 text-[10px] font-bold text-foreground/40 shrink-0">
                      3
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-foreground/50 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      Select Time
                    </span>
                  </div>

                  {slotsForDay.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-foreground/[0.07] bg-foreground/[0.02] px-6 py-12 text-center h-full min-h-[200px]">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-foreground/[0.07] bg-foreground/[0.04] mb-3">
                        <Clock className="h-4 w-4 text-foreground/30" />
                      </div>
                      <p className="text-sm font-bold text-foreground mb-1">No slots available</p>
                      <p className="text-xs text-foreground/45 font-medium leading-relaxed max-w-[200px]">
                        Pick a highlighted date on the calendar to see available times.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
                      {slotsForDay.map((slot: any) => {
                        const isSelected = field.state.value === slot.id;
                        return (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => field.handleChange(slot.id)}
                            className={`group flex items-center justify-between rounded-xl px-5 py-3.5 text-sm font-bold transition-all duration-250 border ${
                              isSelected
                                ? "bg-primary text-primary-foreground border-primary shadow-[0_4px_16px_rgba(37,99,235,0.25)]"
                                : "border-foreground/[0.1] text-foreground/70 hover:border-primary/30 hover:bg-primary/[0.05] hover:text-foreground"
                            }`}
                          >
                            <span>{formatTime(slot.startTime)}</span>
                            <span className={`text-xs font-semibold ${isSelected ? "text-primary-foreground/60" : "text-foreground/35"}`}>
                              → {formatTime(slot.endTime)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {renderError(field.state.meta.errors)}
                </div>
              );
            }}
          />
        </div>
      </div>

      {/* ── Submit ── */}
      <div className="pt-8">
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="group flex h-13 w-full items-center justify-center gap-2.5 rounded-xl bg-foreground px-8 py-3.5 text-sm font-bold text-background transition-all duration-300 hover:bg-primary hover:shadow-[0_8px_24px_rgba(37,99,235,0.3)] active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending request…
                </>
              ) : (
                <>
                  Request Session
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          )}
        />
        <p className="text-center text-[11px] text-foreground/30 font-medium mt-3">
          No charge until the tutor confirms · Free cancellation
        </p>
      </div>
    </form>
  );
}