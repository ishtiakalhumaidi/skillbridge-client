"use client";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import * as z from "zod";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { availabilityService } from "@/src/services/availability.service";

const DAYS_OF_WEEK = [
  "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"
];

export function AvailabilityForm() {
  const form = useForm({
    defaultValues: {
      dayOfWeek: "MONDAY",
      startTime: "09:00",
      endTime: "17:00",
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Adding time slot...");
      try {
        const { error } = await availabilityService.createSlot({
          dayOfWeek: value.dayOfWeek,
        
          startTime: `${value.startTime}:00`, 
          endTime: `${value.endTime}:00`,
        });

        if (error) {
          toast.error(error.message, { id: toastId });
          return;
        }

        toast.success("Time slot added successfully!", { id: toastId });
      } catch (err) {
        toast.error("Something went wrong", { id: toastId });
      }
    },
  });

  return (
    <Card className="w-full max-w-xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Add Availability</CardTitle>
        <CardDescription>
          Select the days and times you are available to teach students.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          {/* Day of Week Field */}
          <form.Field name="dayOfWeek">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Day of the Week</Label>
                <select
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {DAYS_OF_WEEK.map((day) => (
                    <option key={day} value={day}>
                      {day.charAt(0) + day.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </form.Field>

          <div className="grid grid-cols-2 gap-4">
            {/* Start Time Field */}
            <form.Field
              name="startTime"
              validators={{
                onChange: ({ value }) => !value ? "Start time is required" : undefined,
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Start Time</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="time"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors && (
                    <p className="text-sm text-red-500">{field.state.meta.errors[0]}</p>
                  )}
                </div>
              )}
            </form.Field>

            {/* End Time Field */}
            <form.Field
              name="endTime"
              validators={{
                onChange: ({ value }) => !value ? "End time is required" : undefined,
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>End Time</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="time"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors && (
                    <p className="text-sm text-red-500">{field.state.meta.errors[0]}</p>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          {/* Submit Button */}
          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? "Adding slot..." : "Add Time Slot"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
    </Card>
  );
}