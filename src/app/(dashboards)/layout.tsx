import { DashboardSidebar } from "@/components/shared/DashboardSidebar";
import { Navbar } from "@/components/shared/Navbar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getSession() {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/get-session`, {
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

export default async function UnifiedDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role as string;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-700">
      <Navbar session={{ data: session }} />
      
      <div className="container mx-auto px-6 py-12 md:flex md:gap-16 max-w-7xl flex-1">
        <DashboardSidebar role={role} />
        
        <main className="flex-1 min-h-[calc(100vh-10rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}