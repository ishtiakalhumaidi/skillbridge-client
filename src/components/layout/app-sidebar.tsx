"use client";

import {
  adminRoutes,
  studentRoutes,
  tutorRoutes,
} from "@/src/routes/dashboardRoutes";
import { Roles } from "@/src/constants/roles";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { LogOut } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/src/components/ui/sidebar";

export function AppSidebar({ role, user }: { role: string; user: any }) {
  const pathname = usePathname();
  const router = useRouter();

  let routes = studentRoutes; 
  if (role === Roles.tutor) routes = tutorRoutes;
  if (role === Roles.admin) routes = adminRoutes;

  // 2. Logout handler
  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/auth/login");
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h2 className="text-xl font-bold text-primary tracking-tight">
          SkillBridge
        </h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {routes.map((route) => (
                <SidebarMenuItem key={route.title}>
                  <SidebarMenuButton asChild isActive={pathname === route.url}>
                    <Link href={route.url}>
                      <route.icon />
                      <span>{route.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="flex flex-col gap-4">
          <div className="text-sm truncate">
            <p className="font-medium">{user?.name}</p>
            <p className="text-muted-foreground text-xs">{user?.email}</p>
          </div>
          <SidebarMenuButton
            onClick={handleLogout}
            className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
          >
            <LogOut />
            <span>Log out</span>
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
