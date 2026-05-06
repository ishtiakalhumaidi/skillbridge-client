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
      toast.loading("Preparing secure checkout...");
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
      className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-foreground px-5 text-sm font-bold text-background transition-all hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95 shadow-md disabled:opacity-50 disabled:hover:scale-100"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
      Pay Now
    </button>
  );
}