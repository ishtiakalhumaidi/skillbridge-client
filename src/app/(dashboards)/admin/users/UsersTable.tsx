/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Loader2, ShieldAlert, ShieldCheck, MoreHorizontal, UserCog, User } from "lucide-react"
import { format } from "date-fns"
import { adminApi } from "@/lib/api"
import { toast } from "sonner"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuTrigger, DropdownMenuGroup, DropdownMenuSub,
  DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuRadioGroup,
  DropdownMenuRadioItem, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

export function UsersTable({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleStatusUpdate = async (userId: string, currentStatus: string) => {
    try {
      setLoadingId(userId)
      const newStatus = currentStatus === "banned" ? "active" : "banned"
      await adminApi.updateUserStatus(userId, newStatus)
      setUsers(users.map(user => user.id === userId ? { ...user, status: newStatus } : user))
      toast.success(`User status updated to ${newStatus}`)
    } catch (error) {
      toast.error("Failed to update user status. Please try again.")
    } finally {
      setLoadingId(null)
    }
  }

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      setLoadingId(userId)
      await adminApi.updateUserRole(userId, newRole)
      setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user))
      toast.success(`User role updated to ${newRole}`)
    } catch (error) {
      toast.error("Failed to update user role. Please try again.")
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="rounded-3xl border border-foreground/10 bg-background shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-foreground/5 border-b border-foreground/10">
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-xs font-bold tracking-widest text-foreground/50 uppercase py-5">User</TableHead>
            <TableHead className="text-xs font-bold tracking-widest text-foreground/50 uppercase py-5">Role</TableHead>
            <TableHead className="text-xs font-bold tracking-widest text-foreground/50 uppercase py-5">Joined</TableHead>
            <TableHead className="text-xs font-bold tracking-widest text-foreground/50 uppercase py-5">Status</TableHead>
            <TableHead className="text-right text-xs font-bold tracking-widest text-foreground/50 uppercase py-5">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors">
              <TableCell className="py-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-foreground/5 text-foreground/60 shrink-0">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-foreground">{user.name}</span>
                    <span className="text-xs font-semibold text-foreground/50 mt-0.5">{user.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <span className="inline-flex items-center rounded-full bg-foreground/5 border border-foreground/10 px-3 py-1 text-[10px] font-bold text-foreground/80 uppercase tracking-widest">
                  {user.role || "Student"}
                </span>
              </TableCell>
              <TableCell className="text-sm font-semibold text-foreground/70 py-4">
                {user.createdAt ? format(new Date(user.createdAt), "MMM dd, yyyy") : "N/A"}
              </TableCell>
              <TableCell className="py-4">
                {user.status === "banned" ? (
                  <span className="inline-flex items-center rounded-full bg-destructive/10 px-3 py-1 text-[10px] font-bold text-destructive uppercase tracking-widest border border-destructive/20">Banned</span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold text-emerald-500 uppercase tracking-widest border border-emerald-500/20">Active</span>
                )}
              </TableCell>
              <TableCell className="text-right py-4">
                <DropdownMenu>
                  <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-foreground/50 hover:bg-foreground/10 hover:text-foreground transition-colors focus:outline-none">
                    {loadingId === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-2xl border border-foreground/10 bg-background p-2 shadow-xl">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">Manage User</DropdownMenuLabel>
                      
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-foreground transition-colors focus:bg-foreground/5 cursor-default">
                          <UserCog className="h-4 w-4 text-foreground/50" /> Change Role
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="rounded-2xl border border-foreground/10 bg-background p-2 shadow-xl">
                          <DropdownMenuRadioGroup value={user.role} onValueChange={(val) => handleRoleUpdate(user.id, val)}>
                            <DropdownMenuRadioItem value="STUDENT" className="rounded-lg px-3 py-2 text-sm font-semibold focus:bg-foreground/5 cursor-pointer">Student</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="TUTOR" className="rounded-lg px-3 py-2 text-sm font-semibold focus:bg-foreground/5 cursor-pointer">Tutor</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="ADMIN" className="rounded-lg px-3 py-2 text-sm font-semibold focus:bg-foreground/5 cursor-pointer">Admin</DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator className="my-1 bg-foreground/10" />
                      
                      <DropdownMenuItem
                        onClick={() => handleStatusUpdate(user.id, user.status)}
                        className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors cursor-pointer ${user.status === "banned" ? "text-emerald-500 focus:bg-emerald-500/10" : "text-destructive focus:bg-destructive/10"}`}
                      >
                        {user.status === "banned" ? (
                          <><ShieldCheck className="h-4 w-4" /> Unban User</>
                        ) : (
                          <><ShieldAlert className="h-4 w-4" /> Ban User</>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="py-16 text-center text-sm font-medium text-foreground/50">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}