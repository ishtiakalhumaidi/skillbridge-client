/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { Loader2, ArrowRight, GraduationCap, Presentation } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const inputClass =
  "w-full rounded-xl border border-foreground/[0.1] bg-foreground/[0.02] px-4 py-3 text-sm font-medium text-foreground outline-none transition-all duration-200 placeholder:text-foreground/30 focus:border-primary/50 focus:bg-background focus:ring-4 focus:ring-primary/[0.08] hover:border-foreground/20";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const [error, setError] = useState("");

  useEffect(() => {
    if (redirectUrl) toast.info("Please create an account to continue.");
  }, [redirectUrl]);

  const form = useForm({
    defaultValues: { name: "", email: "", password: "", role: "STUDENT" },
    onSubmit: async ({ value }) => {
      setError("");

      const { data, error: authError } = await authClient.signUp.email({
        email: value.email,
        password: value.password,
        name: value.name,
        role: value.role,
      } as any);

      if (authError) {
        setError(authError.message || "An error occurred during registration");
        return;
      }

      const role = (data?.user as { role?: string })?.role || value.role;
      toast.success("Account created! Welcome to SkillBridge.");

      if (redirectUrl) router.push(redirectUrl);
      else if (role === "TUTOR") router.push("/tutor/onboarding");
      else if (role === "ADMIN") router.push("/admin");
      else router.push("/student/dashboard/bookings");

      router.refresh();
    },
  });

  return (
    <div className="flex flex-col gap-7">

      {/* Heading */}
      <div className="space-y-1.5">
        <h1 className="text-4xl font-head tracking-tighter text-foreground">Create account.</h1>
        <p className="text-sm font-medium text-foreground/50">
          Join thousands of students and mentors today.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/[0.06] px-4 py-3 text-xs font-bold text-destructive">
          <span className="h-1.5 w-1.5 rounded-full bg-destructive shrink-0 animate-pulse" />
          {error}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }}
        className="flex flex-col gap-4"
      >
        {/* Role toggle */}
        <form.Field
          name="role"
          children={(field) => (
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/45">
                I want to…
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "STUDENT", label: "Learn", sub: "Student", icon: GraduationCap },
                  { value: "TUTOR", label: "Teach", sub: "Tutor", icon: Presentation },
                ].map(({ value, label, sub, icon: Icon }) => {
                  const active = field.state.value === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => field.handleChange(value)}
                      className={`group flex items-center gap-3 rounded-xl border px-4 py-3.5 text-sm font-bold transition-all duration-250 ${
                        active
                          ? "border-primary/30 bg-primary/[0.06] text-primary"
                          : "border-foreground/[0.1] text-foreground/50 hover:border-foreground/20 hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>
                        {label}
                        <span className="block text-[10px] font-semibold opacity-60 tracking-wide">{sub}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        />

        {/* Name */}
        <form.Field
          name="name"
          validators={{ onChange: z.string().min(2, "At least 2 characters") }}
          children={(field) => (
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/45">Full Name</label>
              <input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className={inputClass}
                placeholder="John Doe"
                autoComplete="name"
              />
              {field.state.meta.errors?.length ? (
                <p className="text-xs font-bold text-destructive">
                  {field.state.meta.errors.filter(Boolean).map((e) => (typeof e === "string" ? e : e?.message)).join(", ")}
                </p>
              ) : null}
            </div>
          )}
        />

        {/* Email */}
        <form.Field
          name="email"
          validators={{ onChange: z.string().email("Invalid email address") }}
          children={(field) => (
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/45">Email Address</label>
              <input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className={inputClass}
                placeholder="name@example.com"
                autoComplete="email"
              />
              {field.state.meta.errors?.length ? (
                <p className="text-xs font-bold text-destructive">
                  {field.state.meta.errors.filter(Boolean).map((e) => (typeof e === "string" ? e : e?.message)).join(", ")}
                </p>
              ) : null}
            </div>
          )}
        />

        {/* Password */}
        <form.Field
          name="password"
          validators={{ onChange: z.string().min(8, "Minimum 8 characters") }}
          children={(field) => (
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/45">Password</label>
              <input
                type="password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className={inputClass}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
              />
              {field.state.meta.errors?.length ? (
                <p className="text-xs font-bold text-destructive">
                  {field.state.meta.errors.filter(Boolean).map((e) => (typeof e === "string" ? e : e?.message)).join(", ")}
                </p>
              ) : null}
            </div>
          )}
        />

        <div className="pt-1">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-foreground text-sm font-bold text-background transition-all duration-300 hover:bg-primary hover:shadow-[0_8px_24px_rgba(37,99,235,0.3)] active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none"
              >
                {isSubmitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Creating account…</>
                ) : (
                  <>Create Account <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
                )}
              </button>
            )}
          />
        </div>
      </form>

      {/* Terms micro-copy */}
      <p className="text-center text-[11px] text-foreground/30 font-medium leading-relaxed">
        By creating an account you agree to our{" "}
        <Link href="#" className="underline underline-offset-2 hover:text-foreground/60 transition-colors">Terms</Link>
        {" "}and{" "}
        <Link href="#" className="underline underline-offset-2 hover:text-foreground/60 transition-colors">Privacy Policy</Link>.
      </p>

      {/* Footer */}
      <p className="text-center text-xs font-medium text-foreground/45">
        Already have an account?{" "}
        <Link
          href={`/login${redirectUrl ? `?redirect=${redirectUrl}` : ""}`}
          className="font-bold text-foreground hover:text-primary transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex h-40 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary/40" /></div>}>
      <RegisterContent />
    </Suspense>
  );
}