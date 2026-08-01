/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Loader2, LogOut, LayoutDashboard, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Logo } from "./Logo";
import { authClient } from "@/lib/auth-client";
import ThemeToggle from "./ThemeToggle";

export function Navbar({ session }: { session: any }) {
  const router = useRouter();
  const pathname = usePathname();
  const sessionData = session?.data;
  const isPending = false;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 👉 FIX: Removed the useEffect(() => { setMobileOpen(false); }, [pathname]);
  // Instead, we use this helper function for mobile links:
  const closeMenu = () => setMobileOpen(false);

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
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? "border-b border-foreground/[0.07] bg-background/90 backdrop-blur-2xl shadow-[0_1px_0_rgba(0,0,0,0.04)]"
            : "bg-background/60 backdrop-blur-xl border-b border-transparent"
        }`}
      >
        <div className="container mx-auto flex h-[72px] items-center justify-between px-5 md:px-10">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-[13px] font-semibold tracking-wide text-foreground/60">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative pb-0.5 transition-colors duration-200 hover:text-foreground ${
                    active ? "text-foreground" : ""
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-0.5 left-0 right-0 h-px bg-primary transition-transform duration-300 origin-left ${
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle showLabel={false} size="sm" />
            <div className="h-5 w-px bg-foreground/10" />
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin text-foreground/40" />
            ) : sessionData ? (
              <div className="flex items-center gap-3">
                <Link
                  href={getDashboardLink()}
                  className="flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.04] px-5 py-2 text-[13px] font-semibold text-foreground transition-all duration-300 hover:border-primary/30 hover:bg-primary/[0.06] hover:text-primary active:scale-95"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/10 text-foreground/50 transition-all duration-300 hover:border-foreground/20 hover:text-foreground active:scale-95"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-5 py-2 text-[13px] font-semibold text-foreground/65 transition-colors hover:text-foreground"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-foreground px-5 py-2 text-[13px] font-bold text-background transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:shadow-[0_4px_16px_rgba(37,99,235,0.3)] active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle showLabel={false} size="sm" />
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/10 text-foreground/70 transition-all hover:bg-foreground/5"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-400 ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          onClick={closeMenu}
          className={`absolute inset-0 bg-background/60 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          className={`absolute right-0 top-0 bottom-0 w-[300px] bg-background border-l border-foreground/[0.07] flex flex-col transition-transform duration-400 ease-out ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-6 h-[72px] border-b border-foreground/[0.07]">
            <span className="text-xs font-bold uppercase tracking-widest text-foreground/40">Menu</span>
            <button
              onClick={closeMenu}
              className="h-8 w-8 flex items-center justify-center rounded-full text-foreground/50 hover:bg-foreground/5 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="flex flex-col gap-1 px-4 pt-6">
            {navLinks.map((link, i) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMenu} // 👉 FIX: Close menu on click
                className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-semibold text-foreground/70 transition-all hover:bg-foreground/[0.04] hover:text-foreground"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="mx-4 mt-6 border-t border-foreground/[0.07]" />

          <div className="flex flex-col gap-3 px-4 pt-6">
            {!sessionData ? (
              <>
                <Link
                  href="/login"
                  onClick={closeMenu} 
                  className="flex items-center justify-center h-12 rounded-xl border border-foreground/10 text-sm font-semibold text-foreground/70 transition-all hover:border-foreground/20 hover:text-foreground"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={closeMenu} 
                  className="flex items-center justify-center h-12 rounded-xl bg-foreground text-sm font-bold text-background transition-all hover:bg-primary hover:text-primary-foreground"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={getDashboardLink()}
                  onClick={closeMenu} 
                  className="flex items-center justify-center gap-2 h-12 rounded-xl border border-foreground/10 text-sm font-semibold text-foreground/70 transition-all hover:border-primary/30 hover:text-primary"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    closeMenu(); 
                  }}
                  className="flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-semibold text-foreground/50 transition-all hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}