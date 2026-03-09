import Link from "next/link"
import { CalendarDays, LayoutDashboard, UserCircle } from "lucide-react"

export default function TutorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto px-4 py-8 md:flex md:gap-8 max-w-7xl">
      <aside className="w-full md:w-64 shrink-0 space-y-2 mb-8 md:mb-0">
        <h2 className="text-lg font-bold mb-4 tracking-tight">Tutor Portal</h2>
        <nav className="flex flex-col space-y-1">
          <Link 
            href="/tutor/dashboard" 
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground font-medium text-sm transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link 
            href="/tutor/availability" 
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-accent text-accent-foreground font-medium text-sm transition-colors"
          >
            <CalendarDays className="h-4 w-4" />
            Availability
          </Link>
          <Link 
            href="/tutor/profile" 
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground font-medium text-sm transition-colors"
          >
            <UserCircle className="h-4 w-4" />
            Profile Settings
          </Link>
        </nav>
      </aside>

      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}