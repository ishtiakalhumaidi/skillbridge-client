import Link from "next/link";
import { BookOpen, User } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-8 md:flex md:gap-8 max-w-7xl">
      {/* Simple Sidebar */}
      <aside className="w-full md:w-64 shrink-0 space-y-2 mb-8 md:mb-0">
        <h2 className="text-lg font-bold mb-4 tracking-tight">Dashboard</h2>
        <nav className="flex flex-col space-y-1">
          <Link
            href="/dashboard/bookings"
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-accent text-accent-foreground font-medium text-sm transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            My Bookings
          </Link>
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground font-medium text-sm transition-colors"
          >
            <User className="h-4 w-4" />
            Profile Settings
          </Link>
         
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
