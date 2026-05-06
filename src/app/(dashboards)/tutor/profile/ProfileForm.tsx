/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useState } from "react";
import { Loader2, Check } from "lucide-react";
import { tutorsApi } from "@/lib/api";

type FormValues = {
  headline: string;
  bio: string;
  hourlyRate: number;
};

const formatErrors = (errors?: unknown[]) =>
  errors?.filter(Boolean).map((e) => (typeof e === "string" ? e : (e as any)?.message)).join(", ");

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
    <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }} className="space-y-8 w-full max-w-xl">
      
      {error && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-bold text-destructive flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-destructive" />
          {error}
        </div>
      )}
      
      {success && (
        <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm font-bold text-primary flex items-center gap-3">
          <Check className="h-4 w-4" />
          Profile updated successfully!
        </div>
      )}

      <form.Field
        name="headline"
        validators={{ onChange: z.string().min(5, "Headline must be at least 5 characters") }}
        children={(field) => (
          <div className="space-y-3">
            <label className="block font-bold text-xs uppercase tracking-widest text-foreground/70">Professional Headline</label>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className="w-full rounded-2xl border border-foreground/20 bg-transparent px-5 py-4 text-base font-semibold text-foreground outline-none transition-all placeholder:text-foreground/30 focus:border-primary focus:ring-4 focus:ring-primary/20 hover:border-foreground/40"
              placeholder="e.g. Senior Software Engineer & Mentor"
            />
            {field.state.meta.errors?.length ? (
              <p className="text-sm font-bold text-destructive animate-in fade-in">{formatErrors(field.state.meta.errors)}</p>
            ) : null}
          </div>
        )}
      />

      <form.Field
        name="hourlyRate"
        validators={{ onChange: z.coerce.number().min(5, "Minimum rate is $5").max(500, "Maximum rate is $500") }}
        children={(field) => (
          <div className="space-y-3">
            <label className="block font-bold text-xs uppercase tracking-widest text-foreground/70">Hourly Rate ($)</label>
            <input
              type="number"
              value={field.state.value}
              onChange={(e) => field.handleChange(Number(e.target.value))}
              className="w-full rounded-2xl border border-foreground/20 bg-transparent px-5 py-4 text-base font-semibold text-foreground outline-none transition-all placeholder:text-foreground/30 focus:border-primary focus:ring-4 focus:ring-primary/20 hover:border-foreground/40"
            />
            {field.state.meta.errors?.length ? (
              <p className="text-sm font-bold text-destructive animate-in fade-in">{formatErrors(field.state.meta.errors)}</p>
            ) : null}
          </div>
        )}
      />

      <form.Field
        name="bio"
        validators={{ onChange: z.string().min(20, "Bio should be at least 20 characters") }}
        children={(field) => (
          <div className="space-y-3">
            <label className="block font-bold text-xs uppercase tracking-widest text-foreground/70">Biography</label>
            <textarea
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className="w-full min-h-[160px] resize-y rounded-2xl border border-foreground/20 bg-transparent px-5 py-4 text-base font-medium text-foreground outline-none transition-all placeholder:text-foreground/30 focus:border-primary focus:ring-4 focus:ring-primary/20 hover:border-foreground/40"
              placeholder="Tell students about your experience, teaching style, and what they can expect..."
            />
            {field.state.meta.errors?.length ? (
              <p className="text-sm font-bold text-destructive animate-in fade-in">{formatErrors(field.state.meta.errors)}</p>
            ) : null}
          </div>
        )}
      />

      <div className="pt-2">
        <form.Subscribe
          selector={(s) => [s.canSubmit, s.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="group flex h-14 w-full md:w-auto items-center justify-center gap-3 rounded-full bg-foreground px-8 font-bold text-background transition-all hover:bg-primary hover:text-primary-foreground hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:hover:scale-100"
            >
              {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              Save Profile
            </button>
          )}
        />
      </div>
    </form>
  );
}