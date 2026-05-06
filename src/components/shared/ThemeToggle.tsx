"use client";

import * as React from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface SwitchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "default" | "lg";
  showLabel?: boolean;
}

export default function ThemeToggle({
  className,
  size = "default",
  showLabel = true,
  ...props
}: SwitchButtonProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeToggle = () => {
    // If currently system -> go to dark first
    if (theme === "system") {
      setTheme("dark");
    } else {
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    }
  };

  const sizes = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4",
    lg: "h-12 px-5 text-base",
  };

  if (!mounted) {
    return (
      <div
        className={cn(
          "rounded-full border border-foreground/10 bg-foreground/5 animate-pulse",
          sizes[size],
          className
        )}
      />
    );
  }

  return (
    <button
      onClick={handleThemeToggle}
      aria-label="Toggle theme"
      className={cn(
        "group relative flex items-center justify-center overflow-hidden",
        "rounded-full bg-background border border-foreground/20 shadow-sm",
        "text-foreground/70 transition-all duration-300",
        "hover:border-primary hover:text-primary hover:shadow-md",
        "active:scale-95",
        sizes[size],
        className
      )}
      {...props}
    >
      <div className="relative flex items-center justify-center gap-2 z-20 w-full">
        
        {/* Icon container */}
        <div className="relative flex items-center justify-center h-5 w-5 shrink-0">

          {/* SYSTEM (Laptop) */}
          <Laptop
            className={cn(
              "absolute transition-all duration-500",
              size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4",
              theme === "system"
                ? "opacity-100 scale-100"
                : "opacity-0 scale-0"
            )}
          />

          {/* SUN */}
          <Sun
            className={cn(
              "absolute transition-all duration-500",
              size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4",
              theme !== "system" && resolvedTheme === "light"
                ? "opacity-100 scale-100 rotate-0"
                : "opacity-0 scale-0 -rotate-90"
            )}
          />

          {/* MOON */}
          <Moon
            className={cn(
              "absolute transition-all duration-500",
              size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4",
              theme !== "system" && resolvedTheme === "dark"
                ? "opacity-100 scale-100 rotate-0"
                : "opacity-0 scale-0 rotate-90"
            )}
          />
        </div>

        {/* Label */}
        {showLabel && (
          <span className="relative font-bold tracking-widest uppercase text-[10px] w-14 text-left">
            
            <span
              className={cn(
                "absolute inset-0 flex items-center transition-all duration-300",
                theme === "system"
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2"
              )}
            >
              System
            </span>

            <span
              className={cn(
                "absolute inset-0 flex items-center transition-all duration-300",
                theme !== "system" && resolvedTheme === "light"
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2"
              )}
            >
              Light
            </span>

            <span
              className={cn(
                "absolute inset-0 flex items-center transition-all duration-300",
                theme !== "system" && resolvedTheme === "dark"
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2"
              )}
            >
              Dark
            </span>

            {/* Placeholder */}
            <span className="opacity-0">System</span>
          </span>
        )}
      </div>

      {/* Shine effect */}
      <span
        className={cn(
          "absolute inset-0 z-10 pointer-events-none",
          "bg-gradient-to-r from-transparent via-foreground/10 to-transparent",
          "dark:via-primary/20",
          "translate-x-[-150%] group-hover:translate-x-[150%]",
          "transition-transform duration-700"
        )}
      />
    </button>
  );
}
