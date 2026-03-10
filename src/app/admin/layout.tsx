"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, LayoutDashboard, Tags, CalendarCheck } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/users", label: "Manage Users", icon: Users },
    { href: "/admin/categories", label: "Categories", icon: Tags },
    { href: "/admin/bookings", label: "All Bookings", icon: CalendarCheck },
  ]

  return (
    <div className="container mx-auto px-4 py-8 md:flex md:gap-8 max-w-7xl">
      <aside className="w-full md:w-64 shrink-0 space-y-2 mb-8 md:mb-0">
        <h2 className="text-lg font-bold mb-4 tracking-tight">Admin Control</h2>

        <nav className="flex flex-col space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

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