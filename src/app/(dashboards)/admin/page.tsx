import { cookies } from "next/headers";
import Link from "next/link";
import {
  Users,
  CalendarCheck,
  FolderOpen,
  ArrowRight,
  Activity,
} from "lucide-react";

async function getPlatformStats() {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`, {
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch stats");
    const responseData = await res.json();
    const stats = responseData.data;
    return {
      totalUsers: stats?.users || 0,
      totalBookings: stats?.bookings?.total || 0,
      totalCategories: stats?.categories || 0,
    };
  } catch (error) {
    return { totalUsers: 0, totalBookings: 0, totalCategories: 0 };
  }
}

export default async function AdminDashboardPage() {
  const stats = await getPlatformStats();

  return (
    <div className="space-y-12 w-full max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2 border-b border-foreground/10 pb-6">
        <h1 className="text-4xl font-head tracking-tighter text-foreground">
          Platform Overview.
        </h1>
        <p className="text-lg font-medium text-foreground/60">
          Monitor the heartbeat of SkillBridge and manage your ecosystem.
        </p>
      </div>

      {/* Premium Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative overflow-hidden rounded-3xl border border-foreground/10 bg-background p-8 shadow-sm transition-all hover:border-foreground/20 hover:shadow-md">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-primary/10 blur-2xl"></div>
          <Users className="h-6 w-6 text-primary mb-6" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/50 mb-2">
            Total Users
          </h3>
          <div className="text-5xl font-head tracking-tight text-foreground">
            {stats.totalUsers}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-foreground/10 bg-background p-8 shadow-sm transition-all hover:border-foreground/20 hover:shadow-md">
          <div
            className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-foreground/5 blur-2xl"
            style={{ animationDelay: "1s" }}
          ></div>
          <CalendarCheck className="h-6 w-6 text-foreground/60 mb-6" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/50 mb-2">
            Total Bookings
          </h3>
          <div className="text-5xl font-head tracking-tight text-foreground">
            {stats.totalBookings}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-foreground/10 bg-background p-8 shadow-sm transition-all hover:border-foreground/20 hover:shadow-md">
          <div
            className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-primary/5 blur-2xl"
            style={{ animationDelay: "2s" }}
          ></div>
          <FolderOpen className="h-6 w-6 text-primary/60 mb-6" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/50 mb-2">
            Categories
          </h3>
          <div className="text-5xl font-head tracking-tight text-foreground">
            {stats.totalCategories}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="pt-6">
        <h2 className="text-3xl font-head tracking-tighter text-foreground mb-8">
          Quick Actions.
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Link
            href="/admin/users"
            className="group flex flex-col justify-between rounded-3xl border border-foreground/10 bg-background p-8 shadow-sm transition-all hover:-translate-y-2 hover:border-primary hover:shadow-md"
          >
            <div>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground/5 text-foreground group-hover:scale-110 transition-transform">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">
                Manage Users
              </h3>
              <p className="text-sm font-medium text-foreground/60">
                View registered users, update roles, or ban accounts.
              </p>
            </div>
            <div className="mt-8 flex items-center text-sm font-bold text-primary">
              Go to Users{" "}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            href="/admin/bookings"
            className="group flex flex-col justify-between rounded-3xl border border-foreground/10 bg-background p-8 shadow-sm transition-all hover:-translate-y-2 hover:border-primary hover:shadow-md"
          >
            <div>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground/5 text-foreground group-hover:scale-110 transition-transform">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">
                Monitor Bookings
              </h3>
              <p className="text-sm font-medium text-foreground/60">
                Track all tutoring sessions across the platform.
              </p>
            </div>
            <div className="mt-8 flex items-center text-sm font-bold text-primary">
              View Bookings{" "}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            href="/admin/categories"
            className="group flex flex-col justify-between rounded-3xl border border-foreground/10 bg-background p-8 shadow-sm transition-all hover:-translate-y-2 hover:border-primary hover:shadow-md"
          >
            <div>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground/5 text-foreground group-hover:scale-110 transition-transform">
                <FolderOpen className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">
                Subject Categories
              </h3>
              <p className="text-sm font-medium text-foreground/60">
                Add or edit the subjects available to your tutors.
              </p>
            </div>
            <div className="mt-8 flex items-center text-sm font-bold text-primary">
              Edit Subjects{" "}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </div>

      {/* System Status */}
      <div className="rounded-3xl border border-foreground/10 bg-foreground/5 p-8 shadow-sm mt-8">
        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-3 mb-8">
          <Activity className="h-5 w-5 text-foreground/40" /> System Status
        </h2>
        <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-16">
          <div className="flex items-center gap-4">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-bold uppercase tracking-widest text-foreground/50">
              API Server: <span className="text-foreground ml-2">Online</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-bold uppercase tracking-widest text-foreground/50">
              Database: <span className="text-foreground ml-2">Connected</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
