import { cookies } from "next/headers"
import Link from "next/link"
import { Users, CalendarCheck, FolderOpen, ArrowRight, Activity } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

async function getPlatformStats() {
  try {
    const cookieStore = await cookies()
    const headers = { Cookie: cookieStore.toString() }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`, { 
      headers, 
      cache: "no-store" 
    })

    if (!res.ok) {
      throw new Error("Failed to fetch stats")
    }

    const responseData = await res.json()
    const stats = responseData.data

    return {
      totalUsers: stats?.users || 0,
      totalBookings: stats?.bookings?.total || 0,
      totalCategories: stats?.categories || 0,
    }
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return { totalUsers: 0, totalBookings: 0, totalCategories: 0 }
  }
}

export default async function AdminDashboardPage() {
  const stats = await getPlatformStats()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Overview</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to the admin control center. Here is what's happening on SkillBridge today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-none shadow-sm bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-primary">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered students, tutors, and admins
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-blue-500">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Lifetime tutoring sessions scheduled
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Categories</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-amber-500">{stats.totalCategories}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Teaching subjects available on the platform
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col border-none shadow-sm bg-card/50 transition-colors hover:bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> Manage Users
            </CardTitle>
            <CardDescription>
              View all registered users, update their roles, or remove accounts.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto pt-0">
            <Link href="/admin/users" className="w-full">
              <Button variant="outline" className="w-full justify-between">
                Go to Users <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="flex flex-col border-none shadow-sm bg-card/50 transition-colors hover:bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-blue-500" /> Manage Bookings
            </CardTitle>
            <CardDescription>
              Monitor all tutoring sessions, view statuses, and track platform usage.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto pt-0">
            <Link href="/admin/bookings" className="w-full">
              <Button variant="outline" className="w-full justify-between">
                Go to Bookings <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="flex flex-col border-none shadow-sm bg-card/50 transition-colors hover:bg-muted/50 md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-amber-500" /> Manage Categories
            </CardTitle>
            <CardDescription>
              Add, edit, or delete the subject categories that tutors can teach.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto pt-0">
            <Link href="/admin/categories" className="w-full">
              <Button variant="outline" className="w-full justify-between">
                Go to Categories <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5 text-green-500" /> System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-muted-foreground">API Server: <span className="text-foreground font-medium">Online</span></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-muted-foreground">Database: <span className="text-foreground font-medium">Connected</span></span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}