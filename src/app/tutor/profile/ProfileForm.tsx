"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { tutorsApi } from "@/lib/api";

type FormValues = {
  headline: string;
  bio: string;
  hourlyRate: number;
};

const formatErrors = (errors?: unknown[]) =>
  errors
    ?.filter(Boolean)
    .map((e) => (typeof e === "string" ? e : (e as any)?.message))
    .join(", ");

export function ProfileForm({ initialData = {} }: { initialData?: Partial<FormValues> }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const form = useForm({
    defaultValues: {
      headline: initialData?.headline || "",
      bio: initialData?.bio || "",
      hourlyRate: initialData?.hourlyRate || 20,
    },

    onSubmit: async ({ value }) => {
      setError("");
      setSuccess(false);

      try {
        await tutorsApi.updateProfile({
          headline: value.headline,
          bio: value.bio,
          hourlyRate: Number(value.hourlyRate),
        });

        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to update profile.");
        }
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6 max-w-2xl"
    >
      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-500/15 p-3 text-sm text-green-600 dark:text-green-400">
          Profile updated successfully!
        </div>
      )}

      {/* Headline */}
      <form.Field
        name="headline"
        validators={{
          onChange: z.string().min(5, "Headline must be at least 5 characters"),
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <label className="text-sm font-medium">Professional Headline</label>

            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Senior Software Engineer & Mentor"
            />

            {field.state.meta.errors?.length ? (
              <p className="text-sm text-destructive">
                {formatErrors(field.state.meta.errors)}
              </p>
            ) : null}
          </div>
        )}
      </form.Field>

      {/* Hourly Rate */}
      <form.Field
        name="hourlyRate"
        validators={{
          onChange: z.coerce
            .number()
            .min(5, "Minimum rate is $5")
            .max(500, "Maximum rate is $500"),
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <label className="text-sm font-medium">Hourly Rate ($)</label>

            <input
              type="number"
              value={field.state.value}
              onChange={(e) => field.handleChange(Number(e.target.value))}
              className="flex h-10 w-full max-w-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />

            {field.state.meta.errors?.length ? (
              <p className="text-sm text-destructive">
                {formatErrors(field.state.meta.errors)}
              </p>
            ) : null}
          </div>
        )}
      </form.Field>

      {/* Bio */}
      <form.Field
        name="bio"
        validators={{
          onChange: z.string().min(20, "Bio should be at least 20 characters"),
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <label className="text-sm font-medium">Biography</label>

            <Textarea
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className="min-h-[150px] resize-y"
              placeholder="Tell students about your experience, teaching style, and what they can expect..."
            />

            {field.state.meta.errors?.length ? (
              <p className="text-sm text-destructive">
                {formatErrors(field.state.meta.errors)}
              </p>
            ) : null}
          </div>
        )}
      </form.Field>

      {/* Submit Button */}
      <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <Button type="submit" disabled={!canSubmit || isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}