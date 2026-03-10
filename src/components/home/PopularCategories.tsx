import Link from "next/link";
import { BookOpen, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function PopularCategories({ categories }: { categories: any[] }) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="w-full py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold tracking-tight">Explore Popular Subjects</h2>
          <p className="text-muted-foreground max-w-[700px] text-lg">
            From coding to calculus, find the exact category you need to level up your skills.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {categories.map((cat: any) => (
            <Link key={cat.id} href={`/tutors?categoryId=${cat.id}`} className="group outline-none">
              <Card className="relative overflow-hidden border bg-background hover:border-primary/50 hover:shadow-md transition-all duration-300 cursor-pointer text-center py-8">
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
                <CardContent className="p-0 flex flex-col items-center justify-center space-y-4">
                  <div className="p-4 bg-primary/10 rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <BookOpen className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <span className="font-semibold text-base md:text-lg">
                    {cat.name}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}