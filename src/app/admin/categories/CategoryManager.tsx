"use client"

import { useState } from "react"
import { useForm } from "@tanstack/react-form"

import { z } from "zod"
import { Loader2, Plus, Pencil, Trash2, FolderOpen } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { categoriesApi } from "@/lib/api"

export function CategoryManager({ initialCategories }: { initialCategories: any[] }) {
  const [categories, setCategories] = useState(initialCategories)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any | null>(null)
  const [error, setError] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Form for Creating and Editing
  const form = useForm({
    defaultValues: {
      name: editingCategory?.name || "",
    },
    onSubmit: async ({ value }) => {
      setError("")
      try {
        if (editingCategory) {
          // Update existing
          const res = await categoriesApi.update(editingCategory.id, { name: value.name })
          setCategories(categories.map(c => c.id === editingCategory.id ? res.data : c))
        } else {
          // Create new
          const res = await categoriesApi.create({ name: value.name })
          // Add default _count so it doesn't break the table UI
          const newCategory = { ...res.data, _count: { tutors: 0, bookings: 0 } } 
          setCategories([...categories, newCategory])
        }
        handleCloseDialog()
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to save category.")
      }
    },
  })

  const handleOpenEdit = (category: any) => {
    setEditingCategory(category)
    form.setFieldValue("name", category.name)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingCategory(null)
    form.reset()
    setError("")
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    
    try {
      setDeletingId(id)
      await categoriesApi.delete(id)
      setCategories(categories.filter(c => c.id !== id))
    } catch (err: any) {
      alert(err.response?.data?.message || "Cannot delete category. It may be in use.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">All Categories</h2>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => !open ? handleCloseDialog() : setIsDialogOpen(true)}>
          <DialogTrigger    className="inline-flex shrink-0 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
          Add Category
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
              <DialogDescription>
                {editingCategory ? "Update the name of this subject category." : "Create a new subject for tutors to teach."}
              </DialogDescription>
            </DialogHeader>
            
            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
              }}
              className="space-y-6 pt-4"
            >
              {error && <div className="text-sm text-destructive">{error}</div>}
              
              <form.Field
                name="name"
                validators={{ onChange: z.string().min(2, "Name must be at least 2 characters") }}
                children={(field) => (
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Category Name</label>
                    <input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="e.g. Mathematics, Programming"
                    />
                 {field.state.meta.errors.map(e => typeof e === 'string' ? e : e?.message).filter(Boolean).join(", ")}
                  </div>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancel</Button>
                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <Button type="submit" disabled={!canSubmit || isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save
                    </Button>
                  )}
                />
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">Active Tutors</TableHead>
              <TableHead className="text-center">Total Bookings</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium flex items-center gap-2">
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                  {category.name}
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-semibold">
                    {category._count?.tutors || 0}
                  </span>
                </TableCell>
                <TableCell className="text-center text-muted-foreground">
                  {category._count?.bookings || 0}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(category)}>
                      <Pencil className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(category.id)}
                      disabled={deletingId === category.id}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      {deletingId === category.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                  No categories found. Create one to get started!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}