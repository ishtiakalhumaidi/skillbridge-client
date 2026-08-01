/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  LayoutDashboard,
  UserCircle,
  Users,
  Tags,
  CalendarCheck,
  BookOpen,
  ChevronRight,
} from "lucide-react";

const roleConfig = {
  ADMIN: {
    title: "Admin Control",
    label: "Admin",
    links: [
      { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
      { href: "/admin/users", label: "Manage Users", icon: Users },
      { href: "/admin/categories", label: "Categories", icon: Tags },
      { href: "/admin/bookings", label: "All Bookings", icon: CalendarCheck },
    ],
  },
  TUTOR: {
    title: "Tutor Portal",
    label: "Tutor",
    links: [
      { href: "/tutor/dashboard", label: "Command Center", icon: LayoutDashboard },
      { href: "/tutor/sessions", label: "Sessions", icon: CalendarCheck },
      { href: "/tutor/availability", label: "Availability", icon: CalendarDays },
      { href: "/tutor/profile", label: "Profile Settings", icon: UserCircle },
    ],
  },
  STUDENT: {
    title: "Student Portal",
    label: "Student",
    links: [
      { href: "/student/dashboard/bookings", label: "My Bookings", icon: BookOpen },
      { href: "/student/dashboard/profile", label: "Profile Settings", icon: UserCircle },
    ],
  },
};

export function DashboardSidebar({ role }: { role: string }) {
  const pathname = usePathname();

  const resolvedRole =
    role === "ADMIN" || pathname.startsWith("/admin")
      ? "ADMIN"
      : role === "TUTOR" || pathname.startsWith("/tutor")
      ? "TUTOR"
      : "STUDENT";

  const config = roleConfig[resolvedRole as keyof typeof roleConfig];

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="w-full md:w-64 lg:w-72 shrink-0">
      {/* Portal label */}
      <div className="flex items-center gap-3 px-4 mb-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/[0.08] text-primary shrink-0">
          <LayoutDashboard className="h-4 w-4" />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/35">
            {config.label}
          </p>
          <p className="text-sm font-bold text-foreground/80 leading-tight">
            {config.title}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 mb-4 h-px bg-foreground/[0.06]" />

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-2">
        {config.links.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, (item as any).exact);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-250 ${
                active
                  ? "bg-foreground text-background shadow-sm"
                  : "text-foreground/60 hover:bg-foreground/[0.05] hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`h-4 w-4 shrink-0 transition-colors duration-200 ${
                    active ? "text-background" : "text-foreground/40 group-hover:text-foreground/70"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {active && (
                <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom card hint */}
      <div className="mx-2 mt-8 rounded-xl border border-foreground/[0.07] bg-foreground/[0.025] p-4">
        <p className="text-xs font-semibold text-foreground/50 mb-1">Need help?</p>
        <p className="text-xs text-foreground/35 leading-relaxed mb-3">
          Visit our help center or contact support.
        </p>
        <Link
          href="#"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary/80 hover:text-primary transition-colors"
        >
          Get support
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
    </aside>
  );
}