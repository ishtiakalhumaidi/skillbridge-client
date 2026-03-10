"use client"

import { useState } from "react"
import { Loader2, ShieldAlert, ShieldCheck, MoreHorizontal, UserCog } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { adminApi } from "@/lib/api"
import { format } from "date-fns"

export function UsersTable({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleStatusUpdate = async (userId: string, currentStatus: string) => {
    try {
      setLoadingId(userId)
      // Toggle the status. Adjust these strings based on your exact backend schema (e.g., "active" vs "banned")
      const newStatus = currentStatus === "banned" ? "active" : "banned" 
      
      await adminApi.updateUserStatus(userId, newStatus)
      
      // Update the local state to reflect the change immediately
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ))
    } catch (error) {
      console.error("Failed to update user status", error)
      alert("Failed to update user status. Please try again.")
    } finally {
      setLoadingId(null)
    }
  }

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      setLoadingId(userId)
      await adminApi.updateUserRole(userId, newRole)
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ))
    } catch (error) {
      console.error("Failed to update user role", error)
      alert("Failed to update user role. Please try again.")
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="rounded-md border bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {user.role || "Student"}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {user.createdAt ? format(new Date(user.createdAt), "MMM dd, yyyy") : "N/A"}
              </TableCell>
              <TableCell>
                {user.status === "banned" ? (
                  <Badge variant="destructive">Banned</Badge>
                ) : (
                  <Badge variant="secondary" className="bg-green-500/10 text-green-600">Active</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 w-8 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    {loadingId === user.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <MoreHorizontal className="h-4 w-4" />
                    )}
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Manage User</DropdownMenuLabel>

                      {/* Submenu for changing roles */}
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <UserCog className="mr-2 h-4 w-4" />
                          Change Role
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          <DropdownMenuRadioGroup value={user.role} onValueChange={(val) => handleRoleUpdate(user.id, val)}>
                            <DropdownMenuRadioItem value="STUDENT">Student</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="TUTOR">Tutor</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="ADMIN">Admin</DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={() => handleStatusUpdate(user.id, user.status)}
                        className={
                          user.status === "banned"
                            ? "text-green-600 focus:text-green-600"
                            : "text-destructive focus:text-destructive"
                        }
                      >
                        {user.status === "banned" ? (
                          <>
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            Unban User
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="mr-2 h-4 w-4" />
                            Ban User
                          </>
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
              <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}