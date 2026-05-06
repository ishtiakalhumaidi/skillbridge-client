import { cookies } from "next/headers"
import { UsersTable } from "./UsersTable"

async function getAllUsers() {
  try {
    const cookieStore = await cookies();
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });
    
    if (!res.ok) return [];
    
    const responseData = await res.json();
    return responseData?.data?.users || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="border-b border-foreground/10 pb-6">
        <h1 className="text-4xl font-head tracking-tighter text-foreground">Manage Users.</h1>
        <p className="text-lg font-medium text-foreground/60 mt-2">
          View all registered students and tutors, and manage their account status.
        </p>
      </div>

      <UsersTable initialUsers={users} />
    </div>
  )
}