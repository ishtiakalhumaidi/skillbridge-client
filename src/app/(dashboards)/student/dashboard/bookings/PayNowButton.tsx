/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { paymentsApi } from "@/lib/api";

export function PayNowButton({ bookingId }: { bookingId: string }) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    try {
      setLoading(true);
      toast.loading("Preparing secure checkout…");
      const res = await paymentsApi.createCheckout(bookingId);
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        throw new Error("Missing checkout URL");
      }
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Payment failed to initialize.");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-amber-500/25 bg-amber-500/[0.08] px-4 text-xs font-bold text-amber-600 dark:text-amber-400 transition-all duration-300 hover:bg-amber-500 hover:text-white hover:border-amber-500 hover:shadow-[0_4px_16px_rgba(245,158,11,0.3)] active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <CreditCard className="h-3.5 w-3.5" />
      )}
      {loading ? "Redirecting…" : "Pay Now"}
    </button>
  );
}