/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  LayoutDashboard,
  UserCircle,
  ChevronRight,
  Users,
  Tags,
  CalendarCheck,
  BookOpen,
} from "lucide-react";

export function DashboardSidebar({ role }: { role: string }) {
  const pathname = usePathname();

  const adminLinks = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/users", label: "Manage Users", icon: Users },
    { href: "/admin/categories", label: "Categories", icon: Tags },
    { href: "/admin/bookings", label: "All Bookings", icon: CalendarCheck },
  ];

  const tutorLinks = [
    { href: "/tutor/dashboard", label: "Command Center", icon: LayoutDashboard },
    { href: "/tutor/availability", label: "Availability", icon: CalendarDays },
    { href: "/tutor/profile", label: "Profile Settings", icon: UserCircle },
  ];

  const studentLinks = [
    { href: "/student/dashboard/bookings", label: "My Bookings", icon: BookOpen },
    { href: "/student/dashboard/profile", label: "Profile Settings", icon: UserCircle },
  ];

  let navItems = studentLinks;
  let title = "Student Portal";

  if (role === "ADMIN" || pathname.startsWith("/admin")) {
    navItems = adminLinks;
    title = "Admin Control";
  } else if (role === "TUTOR" || pathname.startsWith("/tutor")) {
    navItems = tutorLinks;
    title = "Tutor Portal";
  }

  return (
    <aside className="w-full md:w-72 shrink-0 space-y-8 mb-8 md:mb-0">
      <div className="flex items-center gap-3 px-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <LayoutDashboard className="h-5 w-5" />
        </div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-foreground/60">
          {title}
        </h2>
      </div>

      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between rounded-2xl px-5 py-4 text-sm font-bold transition-all duration-300
              ${isActive 
                ? "bg-foreground text-background shadow-lg" 
                : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-4">
                <Icon className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-background" : "text-foreground/50"}`} />
                {item.label}
              </div>
              {isActive && <ChevronRight className="h-4 w-4 opacity-70" />}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}