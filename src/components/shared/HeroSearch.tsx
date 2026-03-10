"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSearch() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      // Redirect to the Browse Tutors page with the search query as a URL parameter
      router.push(`/tutors?search=${encodeURIComponent(query)}`)
    } else {
      router.push(`/tutors`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex w-full  items-center space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by tutor name or subject..."
          className="flex h-12 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
        />
      </div>
      <Button type="submit" size="lg" className="h-12 px-8">
        Search
      </Button>
    </form>
  )
}