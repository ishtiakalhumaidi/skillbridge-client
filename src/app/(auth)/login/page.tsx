/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, Suspense, type SVGProps } from "react";
import { Loader2, ArrowRight, ShieldCheck, Presentation, GraduationCap } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const inputClass =
  "w-full rounded-xl border border-foreground/[0.1] bg-foreground/[0.02] px-4 py-3 text-sm font-medium text-foreground outline-none transition-all duration-200 placeholder:text-foreground/30 focus:border-primary/50 focus:bg-background focus:ring-4 focus:ring-primary/[0.08] hover:border-foreground/20";

const demoAccounts = [
  { key: "admin", label: "Admin", icon: ShieldCheck, email: "admin@skillbridge.com", password: "admin1234", accent: true },
  { key: "tutor", label: "Tutor", icon: Presentation, email: "tutor@skillbridge.com", password: "12345678", accent: false },
  { key: "student", label: "Student", icon: GraduationCap, email: "student@skillbridge.com", password: "12345678", accent: false },
];

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const [error, setError] = useState("");
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

  useEffect(() => {
    if (redirectUrl) toast.info("Please sign in to continue.");
  }, [redirectUrl]);

  const executeLogin = async (email: string, password: string, demoKey: string | null = null) => {
    setError("");
    if (demoKey) setDemoLoading(demoKey);

    const { data, error: authError } = await authClient.signIn.email({ email, password });

    if (demoKey) setDemoLoading(null);

    if (authError) {
      setError(authError.message || "Invalid email or password");
      return;
    }

    const role = (data?.user as { role?: string })?.role;
    toast.success("Welcome back!");

    if (redirectUrl) router.push(redirectUrl);
    else if (role === "TUTOR") router.push("/tutor/dashboard");
    else if (role === "ADMIN") router.push("/admin");
    else router.push("/student/dashboard/bookings");

    router.refresh();
  };

  const form = useForm({
    defaultValues: { email: "", password: "" },
    onSubmit: async ({ value }) => { await executeLogin(value.email, value.password); },
  });

  return (
    <div className="flex flex-col gap-7">

      {/* Heading */}
      <div className="space-y-1.5">
        <h1 className="text-4xl font-head tracking-tighter text-foreground">Welcome back.</h1>
        <p className="text-sm font-medium text-foreground/50">
          Sign in to continue your learning journey.
        </p>
      </div>

      {/* Demo quick access */}
      <div className="rounded-2xl border border-primary/[0.15] bg-primary/[0.04] p-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary/70 text-center mb-4">
          Recruiter Quick Access
        </p>
        <div className="grid grid-cols-3 gap-2.5">
          {demoAccounts.map(({ key, label, icon: Icon, email, password, accent }) => (
            <button
              key={key}
              type="button"
              onClick={() => executeLogin(email, password, key)}
              disabled={demoLoading !== null}
              className={`group flex flex-col items-center justify-center gap-2 rounded-xl border py-3.5 text-xs font-bold transition-all duration-250 disabled:opacity-50 active:scale-95 ${
                accent
                  ? "border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary"
                  : "border-foreground/[0.1] text-foreground/60 hover:bg-foreground hover:text-background hover:border-foreground"
              }`}
            >
              {demoLoading === key ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Icon className="h-4 w-4" />
              )}
              <span className="uppercase tracking-widest text-[9px]">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="relative flex items-center">
        <div className="flex-grow border-t border-foreground/[0.07]" />
        <span className="mx-4 text-[10px] font-bold uppercase tracking-widest text-foreground/35">
          Or sign in with email
        </span>
        <div className="flex-grow border-t border-foreground/[0.07]" />
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
        <form.Field
          name="email"
          validators={{ onChange: z.string().email("Invalid email address") }}
          children={(field) => (
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/45">
                Email Address
              </label>
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

        <form.Field
          name="password"
          validators={{ onChange: z.string().min(1, "Password is required") }}
          children={(field) => (
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/45">
                Password
              </label>
              <input
                type="password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className={inputClass}
                placeholder="••••••••"
                autoComplete="current-password"
              />
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
                  <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</>
                ) : (
                  <>Sign In <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
                )}
              </button>
            )}
          />
        </div>
      </form>

      {/* Footer */}
      <p className="text-center text-xs font-medium text-foreground/45">
        Don&apos;t have an account?{" "}
        <Link
          href={`/register${redirectUrl ? `?redirect=${redirectUrl}` : ""}`}
          className="font-bold text-foreground hover:text-primary transition-colors"
        >
          Sign up free
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex h-40 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary/40" /></div>}>
      <LoginContent />
    </Suspense>
  );
}