/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-children-prop */
"use client"

import { useState } from "react"
import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { Loader2, Plus, Pencil, Trash2, FolderOpen } from "lucide-react"
import { toast } from "sonner"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { categoriesApi } from "@/lib/api"

export function CategoryManager({ initialCategories }: { initialCategories: any[] }) {
  const [categories, setCategories] = useState(initialCategories)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const form = useForm({
    defaultValues: { name: editingCategory?.name || "" },
    onSubmit: async ({ value }) => {
      try {
        if (editingCategory) {
          const res = await categoriesApi.update(editingCategory.id, { name: value.name })
          setCategories(categories.map(c => c.id === editingCategory.id ? res.data : c))
          toast.success(`Category "${value.name}" updated successfully!`)
        } else {
          const res = await categoriesApi.create({ name: value.name })
          const newCategory = { ...res.data, _count: { tutors: 0, bookings: 0 } } 
          setCategories([...categories, newCategory])
          toast.success(`Category "${value.name}" created!`)
        }
        handleCloseDialog()
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to save category.")
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
  }

  const handleDelete = (id: string, categoryName: string) => {
    toast(`Delete "${categoryName}"?`, {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            setDeletingId(id)
            await categoriesApi.delete(id)
            setCategories(categories.filter(c => c.id !== id))
            toast.success("Category deleted successfully.")
          } catch (err: any) {
            toast.error(err.response?.data?.message || "Cannot delete category. It may be in use.")
          } finally {
            setDeletingId(null)
          }
        },
      },
    })
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 border-b border-foreground/10 pb-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-head tracking-tighter text-foreground">Categories.</h2>
          <p className="text-lg font-medium text-foreground/60">Manage the teaching subjects available on the platform.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => !open ? handleCloseDialog() : setIsDialogOpen(true)}>
          <DialogTrigger className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-bold text-background transition-all hover:scale-105 active:scale-95 hover:bg-primary hover:text-primary-foreground shadow-md">
            <Plus className="h-4 w-4" /> Add Category
          </DialogTrigger>
          
          <DialogContent className="border border-foreground/10 rounded-3xl shadow-2xl bg-background sm:max-w-md p-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-head tracking-tighter text-foreground">{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
              <DialogDescription className="text-sm font-medium text-foreground/60 mt-1">
                {editingCategory ? "Update the name of this subject category." : "Create a new subject for tutors to teach."}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }} className="space-y-8">
              <form.Field
                name="name"
                validators={{ onChange: z.string().min(2, "Name must be at least 2 characters") }}
                children={(field) => (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70">Category Name</label>
                    <input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-full rounded-2xl border border-foreground/20 bg-transparent px-5 py-4 text-base font-semibold text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/20 hover:border-foreground/40"
                      placeholder="e.g. Mathematics, Programming"
                    />
                    {field.state.meta.errors ? (
                       <p className="text-sm font-bold text-destructive mt-2">
                         {field.state.meta.errors.map(e => typeof e === 'string' ? e : e?.message).filter(Boolean).join(", ")}
                       </p>
                    ) : null}
                  </div>
                )}
              />
              <div className="flex justify-end gap-4 pt-2">
                <button type="button" onClick={handleCloseDialog} className="rounded-full px-6 py-3 text-sm font-bold text-foreground/60 transition-colors hover:bg-foreground/5 hover:text-foreground">
                  Cancel
                </button>
                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <button type="submit" disabled={!canSubmit || isSubmitting} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-8 text-sm font-bold text-background transition-all hover:scale-105 active:scale-95 disabled:opacity-30 hover:bg-primary hover:text-primary-foreground shadow-md">
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save
                    </button>
                  )}
                />
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-3xl border border-foreground/10 bg-background shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-foreground/5 border-b border-foreground/10">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-bold tracking-widest text-foreground/50 uppercase py-5">Name</TableHead>
              <TableHead className="text-center text-xs font-bold tracking-widest text-foreground/50 uppercase py-5">Active Tutors</TableHead>
              <TableHead className="text-center text-xs font-bold tracking-widest text-foreground/50 uppercase py-5">Total Bookings</TableHead>
              <TableHead className="text-right text-xs font-bold tracking-widest text-foreground/50 uppercase py-5">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id} className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors">
                <TableCell className="py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-foreground/5 text-foreground/60">
                      <FolderOpen className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-sm text-foreground">{category.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center py-4">
                  <span className="inline-flex items-center rounded-full bg-foreground/5 border border-foreground/10 px-4 py-1.5 text-xs font-bold text-foreground">
                    {category._count?.tutors || 0}
                  </span>
                </TableCell>
                <TableCell className="text-center font-bold text-sm text-foreground/60 py-4">
                  {category._count?.bookings || 0}
                </TableCell>
                <TableCell className="text-right py-4">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleOpenEdit(category)} className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground/40 hover:bg-foreground/10 hover:text-foreground transition-colors">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(category.id, category.name)}
                      disabled={deletingId === category.id}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground/40 hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-30"
                    >
                      {deletingId === category.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-16 text-center text-sm font-medium text-foreground/50">
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