"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarDays, LayoutDashboard, UserCircle } from "lucide-react"

export default function TutorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/tutor/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/tutor/availability",
      label: "Availability",
      icon: CalendarDays,
    },
    {
      href: "/tutor/profile",
      label: "Profile Settings",
      icon: UserCircle,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 md:flex md:gap-8 max-w-7xl">
      <aside className="w-full md:w-64 shrink-0 space-y-2 mb-8 md:mb-0">
        <h2 className="text-lg font-bold mb-4 tracking-tight">Tutor Portal</h2>

        <nav className="flex flex-col space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium text-sm transition-colors
                ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      <main className="flex-1">{children}</main>
    </div>
  )
}