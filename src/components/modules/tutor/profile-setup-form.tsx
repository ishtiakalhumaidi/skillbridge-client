"use client";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import * as z from "zod";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { tutorService } from "@/src/services/tutor.service";

export function ProfileSetupForm() {
  const form = useForm({
    defaultValues: {
      bio: "",
      hourlyRate: 0,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Saving your tutor profile...");
      try {
        const { error } = await tutorService.createProfile({
          bio: value.bio,
          hourlyRate: Number(value.hourlyRate),
        });

        if (error) {
          toast.error(error.message, { id: toastId });
          return;
        }

        toast.success("Profile saved successfully!", { id: toastId });
        // Optionally trigger a router.refresh() here to update server components
      } catch (err) {
        toast.error("Something went wrong", { id: toastId });
      }
    },
  });

  return (
    <Card className="w-full max-w-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
        <CardDescription>
          Tell students about yourself and set your base hourly rate to start
          teaching.
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
          {/* Bio Field */}
          <form.Field
            name="bio"
            validators={{
              onChange: ({ value }) => {
                const res = z
                  .string()
                  .min(10, "Bio must be at least 10 characters")
                  .safeParse(value);
                return res.success ? undefined : res.error.issues[0].message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Professional Bio</Label>
                <Textarea
                  id={field.name}
                  name={field.name}
                  placeholder="I am an experienced software engineer specializing in..."
                  className="min-h-[120px]"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Hourly Rate Field */}
          <form.Field
            name="hourlyRate"
            validators={{
              onChange: ({ value }) => {
                const res = z
                  .number()
                  .min(1, "Rate must be greater than $0")
                  .safeParse(Number(value));
                return res.success ? undefined : res.error.issues[0].message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Hourly Rate ($)</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="25.00"
                  value={field.state.value || ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                />
                {field.state.meta.errors && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Submit Button */}
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Profile"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
    </Card>
  );
}
