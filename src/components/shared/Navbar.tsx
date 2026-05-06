/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Loader2, LogOut, LayoutDashboard } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Logo } from "./Logo";
import { authClient } from "@/lib/auth-client";
import ThemeToggle from "./ThemeToggle";

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
    return "/student/dashboard/bookings";
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-foreground/10 bg-background/80 backdrop-blur-2xl transition-colors duration-700">
      <div className="container mx-auto flex h-24 items-center justify-between px-6 md:px-12">
        
        {/* Universal Premium Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-end md:space-x-10">
          <nav className="flex items-center space-x-8 text-sm font-semibold tracking-wide text-foreground/70">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="transition-colors hover:text-primary"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-6 pl-8 border-l border-foreground/10">
            <ThemeToggle />
            
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin text-foreground/50" />
            ) : sessionData ? (
              <div className="flex items-center space-x-4">
                <Link 
                  href={getDashboardLink()} 
                  className="flex items-center gap-2 rounded-full bg-foreground/5 px-6 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-foreground/5 text-foreground/70 transition-all hover:bg-foreground/10 hover:text-foreground hover:scale-105 active:scale-95"
                  title="Log out"
                >
                  <LogOut className="h-4 w-4 ml-0.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/login" 
                  className="rounded-full px-6 py-2.5 text-sm font-semibold text-foreground/80 transition-colors hover:text-primary"
                >
                  Sign in
                </Link>
                <Link 
                  href="/register" 
                  className="rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background shadow-lg transition-all hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Nav Toggle */}
        <div className="flex items-center space-x-4 md:hidden">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger className="rounded-full p-2 text-foreground/70 hover:bg-foreground/5 transition-colors">
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="right" className="border-l border-foreground/10 bg-background">
              <div className="flex flex-col space-y-8 mt-12 px-2">
                {navLinks.map((link) => (
                  <Link key={link.name} href={link.href} className="text-2xl font-head tracking-tight text-foreground hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                ))}
                <div className="pt-8 border-t border-foreground/10 flex flex-col space-y-4">
                  {!sessionData ? (
                    <>
                      <Link href="/login" className="text-lg font-semibold text-foreground hover:text-primary">Sign In</Link>
                      <Link href="/register" className="inline-flex h-14 items-center justify-center rounded-full bg-foreground text-background font-semibold hover:bg-primary hover:text-primary-foreground">Get Started</Link>
                    </>
                  ) : (
                    <>
                      <Link href={getDashboardLink()} className="text-lg font-semibold text-foreground hover:text-primary">Dashboard</Link>
                      <button onClick={handleLogout} className="text-left text-lg font-semibold text-foreground/60 hover:text-foreground">Log Out</button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}