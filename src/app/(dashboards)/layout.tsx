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
  } catch { return null; }
}

export default async function UnifiedDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const role = session.user.role as string;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navbar session={{ data: session }} />

      <div className="container mx-auto px-5 md:px-10 max-w-7xl flex-1">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 py-10 md:py-14">
          <DashboardSidebar role={role} />
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}