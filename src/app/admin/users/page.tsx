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
    // console.log(responseData);
    return responseData?.data?.users || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
        <p className="text-muted-foreground mt-1">
          View all registered students and tutors, and manage their account status.
        </p>
      </div>

      <UsersTable initialUsers={users} />
    </div>
  )
}