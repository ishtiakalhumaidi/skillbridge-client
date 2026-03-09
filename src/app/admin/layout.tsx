import Link from "next/link"
import { Users, LayoutDashboard, Tags, CalendarCheck } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto px-4 py-8 md:flex md:gap-8 max-w-7xl">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 shrink-0 space-y-2 mb-8 md:mb-0">
        <h2 className="text-lg font-bold mb-4 tracking-tight">Admin Control</h2>
        <nav className="flex flex-col space-y-1">
          <Link 
            href="/admin" 
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground font-medium text-sm transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </Link>
          <Link 
            href="/admin/users" 
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-accent text-accent-foreground font-medium text-sm transition-colors"
          >
            <Users className="h-4 w-4" />
            Manage Users
          </Link>
          <Link 
            href="/admin/categories" 
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground font-medium text-sm transition-colors"
          >
            <Tags className="h-4 w-4" />
            Categories
          </Link>
          <Link 
            href="/admin/bookings" 
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground font-medium text-sm transition-colors"
          >
            <CalendarCheck className="h-4 w-4" />
            All Bookings
          </Link>
        </nav>
      </aside>

      {/* Admin Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}