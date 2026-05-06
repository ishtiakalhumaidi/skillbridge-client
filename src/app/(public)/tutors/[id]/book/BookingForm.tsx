/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-children-prop */
"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Loader2, ArrowRight, Clock, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { bookingsApi } from "@/lib/api";

const formatTime = (dateStr: string) => {
  try {
    return format(new Date(dateStr), "h:mm a");
  } catch (e) {
    return dateStr;
  }
};

export function BookingForm({ tutor }: { tutor: any }) {
  const router = useRouter();
  const form = useForm({
    defaultValues: { categoryId: "", availabilityId: "", date: new Date() },
    onSubmit: async ({ value }) => {
      try {
        toast.loading("Sending request to tutor...");

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
        toast.error(
          err.response?.data?.message ||
            "Failed to book session. Please try again.",
        );
      }
    },
  });

  const renderError = (errors: any) => {
    if (!errors || errors.length === 0) return null;
    const errorMessages = errors.map((err: any) =>
      typeof err === "string" ? err : err?.message || "Invalid input",
    );
    return (
      <p className="text-sm font-bold text-destructive mt-2">
        {errorMessages.join(", ")}
      </p>
    );
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-12"
    >
      {/* 1. Interactive Subject Pills */}
      <form.Field
        name="categoryId"
        validators={{
          onChange: z.string().min(1, { message: "Please select a subject" }),
        }}
        children={(field) => (
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-foreground/70">
              1. What do you want to learn?
            </label>
            <div className="flex flex-wrap gap-3">
              {tutor.subjects?.map((subject: any) => {
                const isSelected = field.state.value === subject.categoryId;
                return (
                  <button
                    key={subject.categoryId}
                    type="button"
                    onClick={() => field.handleChange(subject.categoryId)}
                    className={`rounded-full px-6 py-3 text-sm font-bold transition-all duration-300 border ${
                      isSelected
                        ? "bg-foreground text-background border-foreground shadow-md"
                        : "bg-transparent text-foreground/70 border-foreground/20 hover:border-foreground hover:text-foreground"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-foreground/10 pt-10">
        {/* 2. Inline Interactive Calendar */}
        <form.Field
          name="date"
          children={(field) => (
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-foreground/70">
                <CalendarDays className="h-4 w-4" /> 2. Select Date
              </label>
              <div className="rounded-3xl border border-foreground/10 bg-foreground/5 p-4 flex justify-center w-fit shadow-sm">
                <Calendar
                  mode="single"
                  selected={field.state.value}
                  onSelect={(date) => {
                    if (date) {
                      field.handleChange(date);
                      form.setFieldValue("availabilityId", ""); // Reset time slot when date changes
                    }
                  }}
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  className="bg-transparent"
                />
              </div>
            </div>
          )}
        />

        {/* 3. Dynamic Time Slots based on Date */}
        <form.Field
          name="availabilityId"
          validators={{
            onChange: z
              .string()
              .min(1, { message: "Please select an available time slot" }),
          }}
          children={(field) => {

            const availableSlotsForDay =
              tutor.availability?.filter(
                (slot: any) => !slot.isBooked,
              ) || [];

            return (
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-foreground/70">
                  <Clock className="h-4 w-4" /> 3. Select Time
                </label>

                {availableSlotsForDay.length === 0 ? (
                  <div className="rounded-3xl border border-foreground/10 bg-foreground/5 p-8 text-center flex flex-col items-center justify-center h-full min-h-[250px]">
                    <Clock className="h-8 w-8 text-foreground/20 mb-3" />
                    <p className="font-bold text-foreground">
                      No slots available
                    </p>
                    <p className="text-sm font-medium text-foreground/50 mt-1">
                      The tutor is not available. Please pick
                      another date.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {availableSlotsForDay.map((slot: any) => {
                      const isSelected = field.state.value === slot.id;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => field.handleChange(slot.id)}
                          className={`flex items-center justify-between rounded-2xl px-5 py-4 text-base font-bold transition-all duration-300 border ${
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary shadow-md"
                              : "bg-transparent text-foreground border-foreground/20 hover:border-foreground hover:shadow-sm"
                          }`}
                        >
                          <span>{formatTime(slot.startTime)}</span>
                          <span className="opacity-50 text-sm">
                            to {formatTime(slot.endTime)}
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

      <div className="pt-8 border-t border-foreground/10">
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="group flex h-16 w-full items-center justify-center gap-3 rounded-full bg-foreground px-8 py-4 font-bold text-background transition-all hover:bg-primary hover:text-primary-foreground hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              ) : (
                "Request Session"
              )}
              {!isSubmitting && (
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              )}
            </button>
          )}
        />
      </div>
    </form>
  );
}
