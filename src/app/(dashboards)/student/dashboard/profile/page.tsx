/* eslint-disable react/no-children-prop */
"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Loader2, UserCircle, Check, ArrowRight, AlertCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const inputClass =
  "w-full rounded-xl border border-foreground/[0.1] bg-foreground/[0.02] px-4 py-3 text-sm font-medium text-foreground outline-none transition-all duration-200 placeholder:text-foreground/30 focus:border-primary/50 focus:bg-background focus:ring-4 focus:ring-primary/[0.08] hover:border-foreground/20";

function avatarPalette(name = "") {
  const p = [
    { bg: "#EFF6FF", color: "#1D4ED8" },
    { bg: "#F0FDFA", color: "#0F766E" },
    { bg: "#F5F3FF", color: "#6D28D9" },
    { bg: "#FFF7ED", color: "#C2410C" },
    { bg: "#F0FDF4", color: "#15803D" },
  ];
  return p[(name.charCodeAt(0) || 0) % p.length];
}

export default function StudentProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const form = useForm({
    defaultValues: {
      name: session?.user?.name ?? "",
      image: session?.user?.image ?? "",
    },
    onSubmit: async ({ value }) => {
      setError("");
      setSuccess(false);
      try {
        const { error: updateError } = await authClient.updateUser({
          name: value.name,
          image: value.image || undefined,
        });
        if (updateError) { setError(updateError.message || "Failed to update profile."); return; }
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
      } catch {
        setError("An unexpected error occurred. Please try again.");
      }
    },
  });

  if (isPending) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-foreground/25" />
      </div>
    );
  }

  if (!session) return null;

  const name = session.user.name ?? "";
  const palette = avatarPalette(name);

  return (
    <div className="w-full max-w-2xl space-y-10">

      {/* Page header */}
      <div className="pb-6 border-b border-foreground/[0.07]">
        <div className="flex items-center gap-3 mb-3">
          <span className="h-px w-8 bg-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Account</span>
        </div>
        <h1 className="text-4xl font-head tracking-tighter text-foreground leading-[0.9]">
          Profile Settings.
        </h1>
        <p className="text-sm font-medium text-foreground/50 mt-2">
          Manage your personal information and account details.
        </p>
      </div>

      {/* Avatar + identity card */}
      <div className="flex items-center gap-5 p-5 rounded-2xl border border-foreground/[0.07] bg-foreground/[0.02]">
        {/* Avatar */}
        <div
          className="h-16 w-16 rounded-xl overflow-hidden shrink-0 border border-foreground/[0.08] flex items-center justify-center font-head text-xl font-bold"
          style={session.user.image ? undefined : { background: palette.bg, color: palette.color }}
        >
          {session.user.image ? (
            <img
              src={session.user.image}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : name ? (
            name.substring(0, 2).toUpperCase()
          ) : (
            <UserCircle className="h-8 w-8 text-foreground/30" />
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold text-foreground truncate">{name || "—"}</p>
          <p className="text-xs font-medium text-foreground/45 mt-0.5 truncate">{session.user.email}</p>
          <span className="mt-2.5 inline-flex items-center rounded-full border border-foreground/[0.08] bg-background px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-foreground/45">
            Student
          </span>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }}
        className="flex flex-col gap-5"
      >
        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/[0.06] px-4 py-3">
            <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
            <p className="text-xs font-bold text-destructive">{error}</p>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/[0.06] px-4 py-3">
            <Check className="h-4 w-4 text-primary shrink-0" />
            <p className="text-xs font-bold text-primary">Profile updated successfully!</p>
          </div>
        )}

        {/* Name */}
        <form.Field
          name="name"
          validators={{ onChange: z.string().min(2, "At least 2 characters required") }}
          children={(field) => (
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">
                Full Name
              </label>
              <input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className={inputClass}
                placeholder="John Doe"
                autoComplete="name"
              />
              {field.state.meta.errors?.length ? (
                <p className="text-xs font-bold text-destructive">
                  {field.state.meta.errors
                    .map((e) => (typeof e === "string" ? e : e?.message))
                    .filter(Boolean)
                    .join(", ")}
                </p>
              ) : null}
            </div>
          )}
        />

        {/* Email (read-only) */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">
            Email Address
            <span className="ml-2 normal-case tracking-normal font-medium text-foreground/25">(cannot be changed)</span>
          </label>
          <input
            value={session.user.email ?? ""}
            readOnly
            className="w-full rounded-xl border border-foreground/[0.07] bg-foreground/[0.025] px-4 py-3 text-sm font-medium text-foreground/40 outline-none cursor-not-allowed select-none"
          />
        </div>

        {/* Image URL */}
        <form.Field
          name="image"
          validators={{
            onChange: z.string().url("Must be a valid URL").or(z.literal("")),
          }}
          children={(field) => (
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">
                Profile Image URL
                <span className="ml-2 normal-case tracking-normal font-medium text-foreground/25">(optional)</span>
              </label>
              <input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className={inputClass}
                placeholder="https://example.com/avatar.jpg"
                autoComplete="photo"
              />
              {field.state.meta.errors?.length ? (
                <p className="text-xs font-bold text-destructive">
                  {field.state.meta.errors
                    .map((e) => (typeof e === "string" ? e : e?.message))
                    .filter(Boolean)
                    .join(", ")}
                </p>
              ) : null}
              {/* Live preview */}
              {field.state.value && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-8 w-8 rounded-lg overflow-hidden border border-foreground/[0.08] shrink-0">
                    <img
                      src={field.state.value}
                      alt="Preview"
                      className="h-full w-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-foreground/35">Image preview</span>
                </div>
              )}
            </div>
          )}
        />

        {/* Divider */}
        <div className="h-px bg-foreground/[0.06] my-1" />

        {/* Submit */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[11px] font-medium text-foreground/30 leading-relaxed">
            Changes will be reflected across your account immediately.
          </p>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="group flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-foreground px-6 text-sm font-bold text-background transition-all duration-300 hover:bg-primary hover:shadow-[0_8px_24px_rgba(37,99,235,0.3)] active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none"
              >
                {isSubmitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
                ) : (
                  <>Save Changes <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
                )}
              </button>
            )}
          />
        </div>
      </form>
    </div>
  );
}