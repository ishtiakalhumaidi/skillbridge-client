/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function PopularCategories({ categories }: { categories: any[] }) {
  if (!categories || !Array.isArray(categories) || categories.length === 0) return null;

  return (
    <section className="w-full py-32 border-t border-foreground/10">
      <div className="container mx-auto px-6 md:px-12">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-head tracking-tighter mb-6 text-foreground">Top Subjects.</h2>
            <p className="text-xl md:text-2xl text-foreground/60 font-medium">Find the exact category you need to level up your skills today.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {categories.map((cat: any) => (
            <Link key={cat.id} href={`/tutors?categoryId=${cat.id}`} className="group outline-none block h-full">
              <div className="relative flex flex-col justify-between h-48 p-8 rounded-3xl bg-foreground/5 border border-transparent hover:border-primary hover:bg-primary transition-all duration-500 overflow-hidden">
                
                <div className="absolute top-8 right-8 text-foreground/20 group-hover:text-primary-foreground/50 transition-colors transform group-hover:translate-x-2 group-hover:-translate-y-2 duration-500">
                  <ArrowUpRight className="h-10 w-10" />
                </div>
                
                <div className="mt-auto relative z-10">
                  <h3 className="font-head text-2xl text-foreground group-hover:text-primary-foreground transition-colors line-clamp-2 leading-tight">
                    {cat.name}
                  </h3>
                </div>
                
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-16 flex justify-center">
          <Link href="/tutors" className="group flex items-center justify-center h-14 rounded-full bg-foreground px-8 text-sm font-bold text-background transition-all hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95">
            View All Subjects
          </Link>
        </div>
      </div>
    </section>
  );
}