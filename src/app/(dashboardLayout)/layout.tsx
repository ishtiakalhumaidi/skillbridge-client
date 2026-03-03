"use client";

import { useSession } from "@/lib/auth-client";
import { AppSidebar } from "@/src/components/layout/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/src/components/ui/sidebar";
import { Roles } from "@/src/constants/roles";

export default function DashboardLayout({
  children,
  admin,
  student,
  tutor,
}: {
  children: React.ReactNode;
  admin: React.ReactNode;
  student: React.ReactNode;
  tutor: React.ReactNode;
}) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <div className="flex h-screen items-center justify-center">Loading Workspace...</div>;
  }

  if (!session) {
    return null; 
  }

  const role = (session.user as any).role || Roles.student;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/40">
        <AppSidebar role={role} user={session.user} />
        
        <div className="flex-1 flex flex-col min-w-0">
          <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:hidden">
            <SidebarTrigger />
            <h1 className="font-semibold">SkillBridge</h1>
          </header>

          <main className="flex-1 p-6 md:p-8"> based on the role */}
            {role === Roles.admin && admin}
            {role === Roles.tutor && tutor}
            {(role === Roles.student || role === Roles.user) && student}
            
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}