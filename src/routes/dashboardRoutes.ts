import { BookOpen, Calendar, LayoutDashboard, Users, FileText } from "lucide-react";

export const studentRoutes = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Bookings",
    url: "/dashboard/bookings",
    icon: Calendar,
  },
  {
    title: "Find Tutors",
    url: "/tutors",
    icon: Users,
  },
];

export const tutorRoutes = [
  {
    title: "Tutor Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Availability",
    url: "/dashboard/availability",
    icon: Calendar,
  },
  {
    title: "My Subjects",
    url: "/dashboard/subjects",
    icon: BookOpen,
  },
];

export const adminRoutes = [
  {
    title: "Admin Overview",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Manage Users",
    url: "/dashboard/users",
    icon: Users,
  },
  {
    title: "All Bookings",
    url: "/dashboard/bookings",
    icon: FileText,
  },
];