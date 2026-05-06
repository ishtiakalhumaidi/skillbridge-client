/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, Suspense, type SVGProps } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import { authClient, signInWithGoogle } from "@/lib/auth-client";
import { toast } from "sonner";

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

      const userRole = (data?.user as { role?: string })?.role || value.role;
      toast.success("Account created successfully!");

      if (redirectUrl) router.push(redirectUrl);
      else if (userRole === "TUTOR") router.push("/tutor/onboarding");
      else if (userRole === "ADMIN") router.push("/admin");
      else router.push("/student/dashboard/bookings");
      
      router.refresh();
    },
  });

  return (
    <div className="flex flex-col space-y-8">
      
      <div className="text-center lg:text-left space-y-2">
        <h1 className="text-5xl font-head tracking-tighter text-foreground">Create Account.</h1>
        <p className="text-lg text-foreground/60 font-medium">Join thousands of students and mentors.</p>
      </div>

      {/* <button
        onClick={() => signInWithGoogle(redirectUrl)}
        className="group relative flex h-14 w-full items-center justify-center gap-3 rounded-full border border-foreground/20 bg-transparent px-5 py-3 font-bold text-foreground transition-all duration-300 hover:-translate-y-1 hover:border-foreground/40 hover:bg-foreground/5"
        type="button"
      >
        <GoogleIcon className="size-5 transition-transform duration-300 group-hover:scale-110" />
        <span>Sign up with Google</span>
      </button>

      <div className="relative flex items-center py-1">
        <div className="flex-grow border-t border-foreground/10"></div>
        <span className="mx-4 text-xs font-bold uppercase tracking-widest text-foreground/40">Or register with email</span>
        <div className="flex-grow border-t border-foreground/10"></div>
      </div> */}

      {error && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-bold text-destructive flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
          {error}
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }} className="space-y-6">
        
        {/* 👉 FIX: The Account Type Toggle */}
        <form.Field
          name="role"
          children={(field) => (
            <div className="space-y-3">
              <label className="block font-bold text-xs uppercase tracking-widest text-foreground/70">I want to...</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => field.handleChange("STUDENT")}
                  className={`flex h-14 items-center justify-center rounded-2xl border text-sm font-bold transition-all ${
                    field.state.value === "STUDENT"
                      ? "border-primary bg-primary/5 text-primary shadow-sm"
                      : "border-foreground/20 text-foreground/50 hover:border-foreground/40 hover:text-foreground"
                  }`}
                >
                  Learn (Student)
                </button>
                <button
                  type="button"
                  onClick={() => field.handleChange("TUTOR")}
                  className={`flex h-14 items-center justify-center rounded-2xl border text-sm font-bold transition-all ${
                    field.state.value === "TUTOR"
                      ? "border-primary bg-primary/5 text-primary shadow-sm"
                      : "border-foreground/20 text-foreground/50 hover:border-foreground/40 hover:text-foreground"
                  }`}
                >
                  Teach (Tutor)
                </button>
              </div>
            </div>
          )}
        />

        <form.Field
          name="name"
          validators={{ onChange: z.string().min(2, "Name must be at least 2 characters") }}
          children={(field) => (
            <div className="space-y-3">
              <label className="block font-bold text-xs uppercase tracking-widest text-foreground/70">Full Name</label>
              <input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full rounded-2xl border border-foreground/20 bg-transparent px-5 py-4 text-base font-semibold text-foreground outline-none transition-all placeholder:text-foreground/30 focus:border-primary focus:ring-4 focus:ring-primary/20 hover:border-foreground/40"
                placeholder="John Doe"
              />
              {field.state.meta.errors?.length ? (
                <p className="text-sm font-bold text-destructive animate-in fade-in">{field.state.meta.errors.filter(Boolean).map((e) => (typeof e === "string" ? e : e?.message)).join(", ")}</p>
              ) : null}
            </div>
          )}
        />
        <form.Field
          name="email"
          validators={{ onChange: z.string().email("Invalid email address") }}
          children={(field) => (
            <div className="space-y-3">
              <label className="block font-bold text-xs uppercase tracking-widest text-foreground/70">Email Address</label>
              <input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full rounded-2xl border border-foreground/20 bg-transparent px-5 py-4 text-base font-semibold text-foreground outline-none transition-all placeholder:text-foreground/30 focus:border-primary focus:ring-4 focus:ring-primary/20 hover:border-foreground/40"
                placeholder="name@example.com"
              />
            </div>
          )}
        />
        <form.Field
          name="password"
          validators={{ onChange: z.string().min(8, "Password must be at least 8 characters") }}
          children={(field) => (
            <div className="space-y-3">
              <label className="block font-bold text-xs uppercase tracking-widest text-foreground/70">Password</label>
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
        <div className="pt-4">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="group flex h-16 w-full items-center justify-center gap-3 rounded-full bg-foreground px-8 py-4 font-bold text-background transition-all hover:bg-primary hover:text-primary-foreground hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:hover:scale-100"
              >
                {isSubmitting ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : "Create Account"}
                {!isSubmitting && <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />}
              </button>
            )}
          />
        </div>
      </form>

      <div className="text-center font-semibold text-foreground/60 pt-4">
        Already have an account?{" "}
        <Link href={`/login${redirectUrl ? `?redirect=${redirectUrl}` : ""}`} className="text-foreground hover:text-primary transition-colors font-bold ml-1">
          Log in
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>}>
      <RegisterContent />
    </Suspense>
  );
}

function GoogleIcon(props: Readonly<SVGProps<SVGSVGElement>>) {
  return (
    <svg height="100" viewBox="0 0 48 48" width="100" x="0px" xmlns="http://www.w3.org/2000/svg" y="0px" {...props}>
      <path d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20C44,22.659,43.862,21.35,43.611,20.083z" fill="#FFC107" />
      <path d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" fill="#FF3D00" />
      <path d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" fill="#4CAF50" />
      <path d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" fill="#1976D2" />
    </svg>
  );
}