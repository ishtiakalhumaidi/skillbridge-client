/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, Suspense, type SVGProps } from "react";
import {
  Loader2,
  ArrowRight,
  ShieldCheck,
  Presentation,
  GraduationCap,
} from "lucide-react";
import { authClient, signInWithGoogle } from "@/lib/auth-client";
import { toast } from "sonner";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const [error, setError] = useState("");
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

  useEffect(() => {
    if (redirectUrl) toast.info("Please sign in to continue.");
  }, [redirectUrl]);

  // Shared login logic for both the form and the demo buttons
  const executeLogin = async (
    email: string,
    password: string,
    isDemo: string | null = null,
  ) => {
    setError("");
    if (isDemo) setDemoLoading(isDemo);

    const { data, error: authError } = await authClient.signIn.email({
      email,
      password,
    });

    if (isDemo) setDemoLoading(null);

    if (authError) {
      setError(authError.message || "Invalid email or password");
      return;
    }

    const userRole = (data?.user as { role?: string })?.role;
    toast.success("Welcome back!");

    if (redirectUrl) router.push(redirectUrl);
    else if (userRole === "TUTOR") router.push("/tutor/dashboard");
    else if (userRole === "ADMIN") router.push("/admin");
    else router.push("/student/dashboard/bookings");

    router.refresh();
  };

  const form = useForm({
    defaultValues: { email: "", password: "" },
    onSubmit: async ({ value }) => {
      await executeLogin(value.email, value.password);
    },
  });

  return (
    <div className="flex flex-col space-y-8">
      <div className="text-center lg:text-left space-y-2">
        <h1 className="text-5xl font-head tracking-tighter text-foreground">
          Welcome back.
        </h1>
        <p className="text-lg text-foreground/60 font-medium">
          Log in to your account to continue.
        </p>
      </div>

      {/* 👉 THE NEW DEMO LOGIN SECTION */}
      <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-primary text-center">
          Recruiter Quick Access
        </p>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() =>
              executeLogin("admin@skillbridge.com", "admin1234", "admin")
            }
            disabled={demoLoading !== null}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-primary/20 bg-background py-3 text-primary transition-all hover:bg-primary hover:text-primary-foreground active:scale-95 disabled:opacity-50"
          >
            {demoLoading === "admin" ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ShieldCheck className="h-5 w-5" />
            )}
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Admin
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              executeLogin("tutor@skillbridge.com", "12345678", "tutor")
            }
            disabled={demoLoading !== null}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-foreground/20 bg-background py-3 text-foreground transition-all hover:bg-foreground hover:text-background active:scale-95 disabled:opacity-50"
          >
            {demoLoading === "tutor" ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Presentation className="h-5 w-5" />
            )}
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Tutor
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              executeLogin("student@skillbridge.com", "12345678", "student")
            }
            disabled={demoLoading !== null}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-foreground/20 bg-background py-3 text-foreground transition-all hover:bg-foreground hover:text-background active:scale-95 disabled:opacity-50"
          >
            {demoLoading === "student" ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <GraduationCap className="h-5 w-5" />
            )}
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Student
            </span>
          </button>
        </div>
      </div>

      {/* <button
        onClick={() => signInWithGoogle(redirectUrl)}
        className="group relative flex h-14 w-full items-center justify-center gap-3 rounded-full border border-foreground/20 bg-transparent px-5 py-3 font-bold text-foreground transition-all duration-300 hover:-translate-y-1 hover:border-foreground/40 hover:bg-foreground/5"
        type="button"
      >
        <GoogleIcon className="size-5 transition-transform duration-300 group-hover:scale-110" />
        <span>Continue with Google</span>
      </button>*/}

      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-foreground/10"></div>
        <span className="mx-4 text-xs font-bold uppercase tracking-widest text-foreground/40">
          Or email
        </span>
        <div className="flex-grow border-t border-foreground/10"></div>
      </div>

      {error && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-bold text-destructive flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
          {error}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        <form.Field
          name="email"
          validators={{ onChange: z.string().email("Invalid email address") }}
          children={(field) => (
            <div className="space-y-3">
              <label className="block font-bold text-xs uppercase tracking-widest text-foreground/70">
                Email Address
              </label>
              <input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full rounded-2xl border border-foreground/20 bg-transparent px-5 py-4 text-base font-semibold text-foreground outline-none transition-all placeholder:text-foreground/30 focus:border-primary focus:ring-4 focus:ring-primary/20 hover:border-foreground/40"
                placeholder="name@example.com"
              />
              {field.state.meta.errors?.length ? (
                <p className="text-sm font-bold text-destructive animate-in fade-in">
                  {field.state.meta.errors
                    .filter(Boolean)
                    .map((e) => (typeof e === "string" ? e : e?.message))
                    .join(", ")}
                </p>
              ) : null}
            </div>
          )}
        />
        <form.Field
          name="password"
          validators={{ onChange: z.string().min(1, "Password is required") }}
          children={(field) => (
            <div className="space-y-3">
              <label className="block font-bold text-xs uppercase tracking-widest text-foreground/70">
                Password
              </label>
              <input
                type="password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full rounded-2xl border border-foreground/20 bg-transparent px-5 py-4 text-base font-semibold text-foreground outline-none transition-all placeholder:text-foreground/30 focus:border-primary focus:ring-4 focus:ring-primary/20 hover:border-foreground/40"
                placeholder="••••••••"
              />
            </div>
          )}
        />
        <div className="pt-2">
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
                  "Sign In"
                )}
                {!isSubmitting && (
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                )}
              </button>
            )}
          />
        </div>
      </form>

      <div className="text-center font-semibold text-foreground/60 pt-4">
        Don&apos;t have an account?{" "}
        <Link
          href={`/register${redirectUrl ? `?redirect=${redirectUrl}` : ""}`}
          className="text-foreground hover:text-primary transition-colors font-bold ml-1"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

function GoogleIcon(props: Readonly<SVGProps<SVGSVGElement>>) {
  return (
    <svg
      height="100"
      viewBox="0 0 48 48"
      width="100"
      x="0px"
      xmlns="http://www.w3.org/2000/svg"
      y="0px"
      {...props}
    >
      <path
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20C44,22.659,43.862,21.35,43.611,20.083z"
        fill="#FFC107"
      />
      <path
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
        fill="#FF3D00"
      />
      <path
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
        fill="#4CAF50"
      />
      <path
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
        fill="#1976D2"
      />
    </svg>
  );
}
