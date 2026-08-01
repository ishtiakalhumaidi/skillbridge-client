"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";

const suggestions = ["Mathematics", "Python", "Spanish", "Physics", "Design"];

export function HeroSearch() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/tutors?search=${encodeURIComponent(q)}` : "/tutors");
  };

  const handleSuggestion = (s: string) => {
    router.push(`/tutors?search=${encodeURIComponent(s)}`);
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSearch}
        className={`relative flex items-center w-full rounded-2xl border transition-all duration-300 bg-background ${
          focused
            ? "border-primary/40 shadow-[0_0_0_4px_rgba(37,99,235,0.08)]"
            : "border-foreground/[0.1] shadow-[0_2px_16px_rgba(0,0,0,0.04)]"
        }`}
      >
        {/* Search icon */}
        <div className="pl-5 pr-3 text-foreground/30 shrink-0 transition-colors duration-300" style={{ color: focused ? "rgb(37 99 235 / 0.6)" : undefined }}>
          <Search className="h-5 w-5" />
        </div>

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Search by subject or tutor name…"
          className="flex-1 h-14 bg-transparent text-sm font-medium text-foreground placeholder:text-foreground/35 focus:outline-none min-w-0"
        />

        {/* Submit button */}
        <div className="pr-2 shrink-0">
          <button
            type="submit"
            className="flex items-center gap-2 h-10 rounded-xl bg-foreground px-5 text-[13px] font-bold text-background transition-all duration-300 hover:bg-primary hover:shadow-[0_4px_16px_rgba(37,99,235,0.3)] active:scale-95"
          >
            <span className="hidden sm:block">Search</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>

      {/* Quick suggestions */}
      <div className="flex flex-wrap items-center gap-2 mt-4 px-1">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-foreground/30 shrink-0">
          Try:
        </span>
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => handleSuggestion(s)}
            className="rounded-full border border-foreground/[0.08] bg-foreground/[0.03] px-3.5 py-1.5 text-xs font-semibold text-foreground/50 transition-all duration-200 hover:border-primary/30 hover:bg-primary/[0.05] hover:text-primary"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}