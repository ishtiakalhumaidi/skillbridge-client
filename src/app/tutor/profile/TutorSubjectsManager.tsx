"use client"

import { useState } from "react"
import { Loader2, Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { tutorSubjectsApi } from "@/lib/api"

export function TutorSubjectsManager({ 
  allCategories, 
  initialTutorSubjects = [] 
}: { 
  allCategories: any[], 
  initialTutorSubjects?: any[] 
}) {
  const [activeSubjects, setActiveSubjects] = useState(initialTutorSubjects)
  const [selectedCategoryId, setSelectedCategoryId] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [error, setError] = useState("")

  const availableCategories = allCategories.filter(
    (cat) => !activeSubjects.some((sub: any) => sub.categoryId === cat.id)
  )

  const handleAddSubject = async () => {
    if (!selectedCategoryId) return;
    
    setError("")
    setIsAdding(true)
    
    try {
      const res = await tutorSubjectsApi.add(selectedCategoryId)
      // The backend returns the newly created tutorSubject with the category included
      setActiveSubjects([...activeSubjects, res.data])
      setSelectedCategoryId("") // Reset dropdown
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add subject.")
    } finally {
      setIsAdding(false)
    }
  }

  const handleRemoveSubject = async (categoryId: string) => {
    setError("")
    setRemovingId(categoryId)
    
    try {
      await tutorSubjectsApi.remove(categoryId)
      setActiveSubjects(activeSubjects.filter((sub: any) => sub.categoryId !== categoryId))
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to remove subject.")
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium">
          {error}
        </div>
      )}

      {/* Display Active Subjects */}
      <div>
        <h3 className="text-sm font-medium mb-3">Subjects You Teach</h3>
        {activeSubjects.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">You haven't added any subjects yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {activeSubjects.map((subject: any) => (
              <Badge key={subject.categoryId} variant="secondary" className="pl-3 pr-1 py-1.5 text-sm flex items-center gap-2">
                {subject.category?.name || "Subject"}
                <button
                  onClick={() => handleRemoveSubject(subject.categoryId)}
                  disabled={removingId === subject.categoryId}
                  className="rounded-full p-0.5 hover:bg-destructive/20 hover:text-destructive transition-colors disabled:opacity-50"
                  aria-label="Remove subject"
                >
                  {removingId === subject.categoryId ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <X className="h-3 w-3" />
                  )}
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

    
      <div className="flex flex-col sm:flex-row gap-3 items-end pt-2 border-t">
        <div className="w-full sm:flex-1 space-y-2">
          <label className="text-sm font-medium leading-none">Add a New Subject</label>
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="" disabled>Choose a subject category...</option>
            {availableCategories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <Button 
          onClick={handleAddSubject} 
          disabled={!selectedCategoryId || isAdding}
          className="w-full sm:w-auto"
        >
          {isAdding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
          Add
        </Button>
      </div>
    </div>
  )
}