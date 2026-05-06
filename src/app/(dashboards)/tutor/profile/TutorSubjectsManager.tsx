/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Loader2, Plus, X } from "lucide-react"
import { tutorSubjectsApi } from "@/lib/api"

export function TutorSubjectsManager({ allCategories, initialTutorSubjects = [] }: { allCategories: any[], initialTutorSubjects?: any[] }) {
  const [activeSubjects, setActiveSubjects] = useState(initialTutorSubjects)
  const [selectedCategoryId, setSelectedCategoryId] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [error, setError] = useState("")

  const availableCategories = allCategories.filter((cat) => !activeSubjects.some((sub: any) => sub.categoryId === cat.id))

  const handleAddSubject = async () => {
    if (!selectedCategoryId) return;
    setError("")
    setIsAdding(true)
    try {
      const res = await tutorSubjectsApi.add(selectedCategoryId)
      setActiveSubjects([...activeSubjects, res.data])
      setSelectedCategoryId("")
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
    <div className="space-y-8">
      {error && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-bold text-destructive">
          {error}
        </div>
      )}

      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/70 mb-4">Subjects You Teach</h3>
        {activeSubjects.length === 0 ? (
          <p className="text-sm text-foreground/40 italic font-medium">You haven&apos;t added any subjects yet.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {activeSubjects.map((subject: any) => (
              <div key={subject.categoryId} className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-foreground/5 pl-4 pr-1.5 py-1.5 text-sm font-semibold text-foreground transition-colors hover:border-foreground/40">
                {subject.category?.name || "Subject"}
                <button
                  onClick={() => handleRemoveSubject(subject.categoryId)}
                  disabled={removingId === subject.categoryId}
                  className="rounded-full p-1.5 hover:bg-destructive hover:text-destructive-foreground transition-colors disabled:opacity-50"
                  aria-label="Remove subject"
                >
                  {removingId === subject.categoryId ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-end pt-8 border-t border-foreground/10">
        <div className="w-full sm:flex-1 space-y-3">
          <label className="block font-bold text-xs uppercase tracking-widest text-foreground/70">Add a New Subject</label>
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="w-full rounded-2xl border border-foreground/20 bg-transparent px-5 py-4 text-base font-semibold text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/20 hover:border-foreground/40 appearance-none cursor-pointer"
          >
            <option value="" disabled>Choose a subject category...</option>
            {availableCategories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <button 
          onClick={handleAddSubject} 
          disabled={!selectedCategoryId || isAdding}
          className="group flex h-[58px] w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-foreground px-8 font-bold text-background transition-all hover:bg-primary hover:text-primary-foreground active:scale-[0.98] disabled:opacity-30 disabled:hover:scale-100"
        >
          {isAdding ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
          Add
        </button>
      </div>
    </div>
  )
}