"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Loader2, LogOut, LayoutDashboard, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./ThemeToggle";
import { signOut } from "@/lib/auth-client";


export function Navbar({ session }: { session: any }) {
  const router = useRouter();

  const sessionData = session?.data;

  const isPending = false;

  const navLinks = [
    { name: "Browse Tutors", href: "/tutors" },
    { name: "How it Works", href: "/#how-it-works" },
  ];

  const getDashboardLink = () => {
    const role = (sessionData?.user as { role?: string })?.role;
    if (role === "TUTOR") return "/tutor/dashboard";
    if (role === "ADMIN") return "/admin";
    return "/dashboard/bookings";
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } 
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-mono text-xl font-bold tracking-tight">
            Skill<span className="text-primary">Bridge</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-end md:space-x-6">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-2">
            <ThemeToggle />

            {isPending ? (
              <div className="flex items-center space-x-2 ml-4 px-4">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : sessionData ? (
              <div className="flex items-center space-x-2 ml-4">
                <Link href={getDashboardLink()}>
                  <Button variant="outline" className="gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="gap-2 text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-4">
                <Link href="/login">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link href="/register">
                  <Button>Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center space-x-2 md:hidden">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-10 w-10 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-4 mt-8 text-sm font-medium">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="hover:text-primary"
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  {isPending ? (
                    <div className="flex justify-center p-4">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : sessionData ? (
                    <>
                      <div className="flex items-center gap-2 px-2 pb-2 mb-2 border-b text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span className="truncate">
                          {sessionData.user?.email}
                        </span>
                      </div>
                      <Link href={getDashboardLink()}>
                        <button className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2">
                          <LayoutDashboard className="h-4 w-4" /> Dashboard
                        </button>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-destructive/10 hover:text-destructive h-10 px-4 py-2 gap-2"
                      >
                        <LogOut className="h-4 w-4" /> Log out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login">
                        <button className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                          Log in
                        </button>
                      </Link>
                      <Link href="/register">
                        <button className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                          Sign up
                        </button>
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
