/* eslint-disable react/no-children-prop */
"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Loader2, UserCircle, Check } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function StudentProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const form = useForm({
    defaultValues: {
      name: session?.user?.name || "",
      image: session?.user?.image || "",
    },
    onSubmit: async ({ value }) => {
      setError("");
      setSuccess(false);
      try {
        const { error: updateError } = await authClient.updateUser({
          name: value.name,
          image: value.image || undefined,
        });

        if (updateError) {
          setError(updateError.message || "Failed to update profile.");
          return;
        }
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
        setError("An unexpected error occurred. Please try again.");
      }
    },
  });

  if (isPending) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-foreground/40" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="space-y-12 w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="border-b border-foreground/10 pb-6">
        <h1 className="text-4xl font-head tracking-tighter text-foreground">Profile Settings.</h1>
        <p className="text-lg font-medium text-foreground/60 mt-2">
          Manage your personal information and account details.
        </p>
      </div>

      <div className="rounded-3xl border border-foreground/10 bg-foreground/5 p-8 md:p-12 shadow-sm">
        
        <div className="flex flex-col md:flex-row md:items-center gap-8 mb-12">
          <div className="h-28 w-28 overflow-hidden rounded-full border-2 border-background shadow-md bg-background shrink-0">
            {session.user.image ? (
              <img src={session.user.image} alt={session.user.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-foreground/30 bg-foreground/5">
                <UserCircle className="h-12 w-12" />
              </div>
            )}
          </div>
          <div>
            <p className="font-head text-3xl tracking-tight text-foreground">{session.user.name}</p>
            <p className="text-foreground/60 font-medium text-base mt-1">{session.user.email}</p>
            <div className="mt-4 inline-flex items-center rounded-full bg-background border border-foreground/10 px-4 py-1.5 text-xs font-bold tracking-widest uppercase text-foreground/70 shadow-sm">
              Student Account
            </div>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }} className="space-y-8 max-w-xl">
          
          {error && (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-bold text-destructive flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
              {error}
            </div>
          )}
          
          {success && (
            <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm font-bold text-primary flex items-center gap-3">
              <Check className="h-5 w-5" />
              Profile updated successfully!
            </div>
          )}

          <form.Field
            name="name"
            validators={{ onChange: z.string().min(2, "Name must be at least 2 characters") }}
            children={(field) => (
              <div className="space-y-3">
                <label className="block font-bold text-xs uppercase tracking-widest text-foreground/70">Full Name</label>
                <input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full rounded-2xl border border-foreground/20 bg-background px-5 py-4 text-base font-semibold text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/20 hover:border-foreground/40"
                  placeholder="John Doe"
                />
                {field.state.meta.errors ? (
                  <p className="text-sm font-bold text-destructive animate-in fade-in">
                    {field.state.meta.errors.map((e) => (typeof e === "string" ? e : e?.message)).filter(Boolean).join(", ")}
                  </p>
                ) : null}
              </div>
            )}
          />

          <form.Field
            name="image"
            validators={{ onChange: z.string().url("Must be a valid image URL").or(z.literal("")) }}
            children={(field) => (
              <div className="space-y-3">
                <label className="block font-bold text-xs uppercase tracking-widest text-foreground/70">Profile Image URL (Optional)</label>
                <input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full rounded-2xl border border-foreground/20 bg-background px-5 py-4 text-base font-semibold text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/20 hover:border-foreground/40"
                  placeholder="https://example.com/avatar.jpg"
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
                  className="group flex h-14 w-full md:w-auto items-center justify-center gap-2 rounded-full bg-foreground px-8 font-bold text-background transition-all hover:bg-primary hover:text-primary-foreground active:scale-[0.98] disabled:opacity-30 disabled:hover:scale-100"
                >
                  {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  Save Changes
                </button>
              )}
            />
          </div>
        </form>
      </div>
    </div>
  );
}