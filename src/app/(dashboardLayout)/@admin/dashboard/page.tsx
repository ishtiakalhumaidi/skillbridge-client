import { adminService } from "@/src/services/admin.service";
import { UserTable } from "@/src/components/modules/admin/user-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Users } from "lucide-react";

export default async function AdminDashboard() {
  // Fetch users securely on the server
  const { data: users, error } = await adminService.getAllUsers();

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
        <p className="text-muted-foreground mt-2">
          Monitor platform activity and manage users.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Recent Users</h2>
        {error ? (
          <div className="p-4 bg-red-50 text-red-500 rounded-md border border-red-200">
            {error.message}
          </div>
        ) : (
          <UserTable users={users || []} />
        )}
      </div>
    </div>
  );
}