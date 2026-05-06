import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] bg-background p-6 text-center transition-colors duration-700 animate-in fade-in zoom-in-95 duration-1000">
      <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-foreground/5 border border-foreground/10 mb-8 shadow-sm">
        <FileQuestion className="h-10 w-10 text-foreground/40" />
      </div>

      <h1 className="text-7xl md:text-9xl font-head tracking-tighter text-foreground mb-4">
        404
      </h1>

      <h2 className="text-2xl font-bold tracking-tight text-foreground/80 mb-4">
        Page not found.
      </h2>

      <p className="text-lg font-medium text-foreground/60 max-w-md mb-10 leading-relaxed">
        We couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
      </p>

      <Link href="/">
        <button className="group flex h-14 items-center justify-center gap-2 rounded-full bg-foreground px-8 font-bold text-background transition-all hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95 shadow-md">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Return Home
        </button>
      </Link>
    </div>
  );
}