/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-children-prop */
"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Rocket, ArrowRight } from "lucide-react";
import { tutorsApi } from "@/lib/api";

export function OnboardingForm() {
  const router = useRouter();
  const [error, setError] = useState("");

  const form = useForm({
    defaultValues: {
      headline: "",
      bio: "",
      hourlyRate: 20,
    },
    onSubmit: async ({ value }) => {
      setError("");
      try {
        await tutorsApi.create({
          headline: value.headline,
          bio: value.bio,
          hourlyRate: Number(value.hourlyRate),
        });
        router.push("/tutor/dashboard");
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Failed to create tutor profile. You might already have one!",
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
      className="space-y-8"
    >
      {error && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-bold text-destructive flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
          {error}
        </div>
      )}

      {/* Headline */}
      <form.Field
        name="headline"
        validators={{
          onChange: z.string().min(5, { message: "Headline must be at least 5 characters" }),
        }}
        children={(field) => (
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70">
              Professional Headline
            </label>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className="w-full rounded-2xl border border-foreground/20 bg-transparent px-5 py-4 text-base font-semibold text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/20 hover:border-foreground/40"
              placeholder="e.g. Expert Math Tutor & Curriculum Developer"
            />
            {renderError(field.state.meta.errors)}
          </div>
        )}
      />

      {/* Hourly Rate */}
      <form.Field
        name="hourlyRate"
        validators={{
          onChange: z.coerce
            .number()
            .min(5, { message: "Minimum rate is $5/hr" })
            .max(500, { message: "Maximum rate is $500/hr" }),
        }}
        children={(field) => (
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70">
              Hourly Rate ($)
            </label>
            <input
              type="number"
              value={field.state.value}
              onChange={(e) => field.handleChange(Number(e.target.value))}
              className="w-full rounded-2xl border border-foreground/20 bg-transparent px-5 py-4 text-base font-semibold text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/20 hover:border-foreground/40"
              placeholder="25"
            />
            {renderError(field.state.meta.errors)}
          </div>
        )}
      />

      {/* Bio */}
      <form.Field
        name="bio"
        validators={{
          onChange: z.string().min(20, { message: "Bio must be at least 20 characters long" }),
        }}
        children={(field) => (
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70">
              About Me (Bio)
            </label>
            <textarea
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Tell students about your qualifications, teaching style, and what they will learn..."
              className="w-full min-h-[160px] resize-y rounded-2xl border border-foreground/20 bg-transparent px-5 py-4 text-base font-medium text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/20 hover:border-foreground/40"
            />
            {renderError(field.state.meta.errors)}
          </div>
        )}
      />

      <div className="pt-6">
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="group flex h-16 w-full items-center justify-center gap-3 rounded-full bg-foreground px-8 py-4 font-bold text-background transition-all hover:bg-primary hover:text-primary-foreground hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:hover:scale-100 shadow-md"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              ) : (
                <Rocket className="mr-2 h-5 w-5" />
              )}
              Launch Tutor Profile
              {!isSubmitting && <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 ml-1" />}
            </button>
          )}
        />
      </div>
    </form>
  );
}