"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "default" | "lg";
  showLabel?: boolean;
}

export default function ThemeToggle({
  className,
  size = "default",
  showLabel = true,
}: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const cycle = () => {
    if (theme === "system") setTheme("light");
    else if (resolvedTheme === "light") setTheme("dark");
    else setTheme("system");
  };

  const sizes = {
    sm: { btn: "h-8 px-3 gap-1.5", icon: "h-3.5 w-3.5", text: "text-[10px]" },
    default: { btn: "h-10 px-4 gap-2", icon: "h-4 w-4", text: "text-[11px]" },
    lg: { btn: "h-12 px-5 gap-2.5", icon: "h-[18px] w-[18px]", text: "text-xs" },
  };

  const s = sizes[size];

  const isDark = theme !== "system" && resolvedTheme === "dark";
  const isLight = theme !== "system" && resolvedTheme === "light";
  const isSystem = theme === "system";

  const currentLabel = isSystem ? "System" : isLight ? "Light" : "Dark";
  const NextIcon = isSystem ? Sun : isLight ? Moon : Monitor;

  if (!mounted) {
    return (
      <div
        className={cn(
          "rounded-full border border-foreground/10 bg-foreground/[0.04] animate-pulse",
          s.btn,
          className
        )}
        style={{ display: "inline-flex" }}
      />
    );
  }

  return (
    <button
      onClick={cycle}
      aria-label={`Switch theme. Current: ${currentLabel}`}
      className={cn(
        "relative inline-flex items-center overflow-hidden rounded-full",
        "border border-foreground/[0.1] bg-background",
        "text-foreground/55 font-semibold uppercase tracking-[0.1em]",
        "transition-all duration-300",
        "hover:border-foreground/20 hover:text-foreground",
        "active:scale-95",
        s.btn,
        className
      )}
    >
      {/* Icon */}
      <div className="relative shrink-0" style={{ width: parseInt(s.icon) || 16, height: parseInt(s.icon) || 16 }}>
        {/* System */}
        <Monitor
          className={cn(
            "absolute inset-0 transition-all duration-400",
            s.icon,
            isSystem ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50"
          )}
        />
        {/* Light */}
        <Sun
          className={cn(
            "absolute inset-0 transition-all duration-400",
            s.icon,
            isLight ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50"
          )}
        />
        {/* Dark */}
        <Moon
          className={cn(
            "absolute inset-0 transition-all duration-400",
            s.icon,
            isDark ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50"
          )}
        />
      </div>

      {/* Label */}
      {showLabel && (
        <span className={cn("relative overflow-hidden shrink-0", s.text)}>
          {/* Fixed-width spacer for longest word */}
          <span className="invisible">System</span>
          {/* Animated label overlay */}
          <span className="absolute inset-0 flex items-center">
            {currentLabel}
          </span>
        </span>
      )}

      {/* Shimmer hover effect */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-foreground/[0.06] to-transparent transition-transform duration-700 group-hover:translate-x-full" />
    </button>
  );
}