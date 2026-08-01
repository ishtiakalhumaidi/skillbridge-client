/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { BarChart3, DollarSign, Users, CalendarClock, AlertCircle } from "lucide-react";
import { TutorAnalyticsChart } from "./TutorAnalyticsChart";

async function getTutorAnalytics() {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tutors/my-analytics`, {
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.data || [];
  } catch { return []; }
}

async function getMyBookings() {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/my-bookings`, {
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.data?.bookings ?? data?.data ?? [];
  } catch { return []; }
}

async function getSession() {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/get-session`, {
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

export default async function TutorDashboardPage() {
  const [bookings, session, analyticsData] = await Promise.all([
    getMyBookings(),
    getSession(),
    getTutorAnalytics(),
  ]);

  const currentUserId = session?.user?.id;
  const tutorBookings = Array.isArray(bookings)
    ? bookings.filter((b: any) => b.tutor?.userId === currentUserId)
    : [];

  // 👉 Advanced Derived Metrics (Zero extra DB calls!)
  const totalRevenue = tutorBookings
    .filter((b) => b.status === "COMPLETED" && b.paymentStatus === "PAID")
    .reduce((sum, b) => sum + (b.pricePaid || 0), 0);
  const uniqueStudents = new Set(tutorBookings.map((b) => b.studentId)).size;
  const pendingCount = tutorBookings.filter((b) => b.status === "PENDING").length;
  const upcomingCount = tutorBookings.filter((b) => b.status === "CONFIRMED").length;

  const metrics = [
    {
      label: "Total Earnings",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      delay: "delay-[0ms]"
    },
    {
      label: "Upcoming Sessions",
      value: upcomingCount.toString(),
      icon: CalendarClock,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      delay: "delay-[75ms]"
    },
    {
      label: "Action Required",
      value: pendingCount.toString(),
      icon: AlertCircle,
      color: pendingCount > 0 ? "text-rose-500" : "text-foreground/40",
      bg: pendingCount > 0 ? "bg-rose-500/10" : "bg-foreground/5",
      delay: "delay-[150ms]"
    },
    {
      label: "Unique Students",
      value: uniqueStudents.toString(),
      icon: Users,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      delay: "delay-[225ms]"
    },
  ];

  return (
    <div className="w-full max-w-5xl space-y-10">
      {/* Page header */}
      <div className="pb-6 border-b border-foreground/[0.07] animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-3 mb-3">
          <span className="h-px w-8 bg-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Dashboard
          </span>
        </div>
        <h1 className="text-4xl font-head tracking-tighter text-foreground leading-[0.9]">
          Command Center.
        </h1>
        <p className="text-sm font-medium text-foreground/50 mt-2">
          Track your metrics, revenue, and overall platform growth.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div
            key={i}
            className={`relative overflow-hidden rounded-2xl border border-foreground/[0.07] bg-background p-6 transition-all duration-300 hover:border-foreground/20 hover:shadow-lg hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both ${m.delay}`}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">
                {m.label}
              </p>
              <div className={`p-2 rounded-xl ${m.bg}`}>
                <m.icon className={`h-4 w-4 ${m.color}`} />
              </div>
            </div>
            <p className="text-4xl font-head tracking-tight text-foreground">
              {m.value}
            </p>
          </div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="pt-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-head tracking-tighter text-foreground">
              Performance Overview
            </h2>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 bg-foreground/5 px-3 py-1.5 rounded-full border border-foreground/10">
            Past 12 Months
          </span>
        </div>

        <TutorAnalyticsChart data={analyticsData} />
      </div>
    </div>
  );
}