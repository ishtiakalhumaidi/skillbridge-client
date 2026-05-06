import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-background transition-colors duration-700">
      
      {/* LEFT SIDE - Premium Minimalist Visual Panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-foreground/5 lg:flex p-16 border-r border-foreground/10">
        
        <div className="relative z-10 flex items-center gap-2 animate-in fade-in slide-in-from-left-8 duration-700 ease-out">
          <Logo />
        </div>

        <div className="relative z-10 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out delay-200 fill-mode-both">
          <h2 className="text-6xl xl:text-7xl font-head tracking-tighter text-foreground leading-[1.1] mb-8">
            Master your craft.<br />
            <span className="text-foreground/30">Zero limits.</span>
          </h2>
          <p className="text-xl font-medium text-foreground/60 max-w-md leading-relaxed">
            Join an elite community of learners and mentors dedicated to absolute excellence.
          </p>
        </div>

        {/* Minimalist decorative circles */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
           <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] animate-pulse"></div>
           <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-foreground/5 blur-[120px] animate-pulse" style={{ animationDelay: "2s" }}></div>
        </div>
      </div>

      {/* RIGHT SIDE - The Form Container */}
      <div className="relative flex w-full flex-col items-center justify-center lg:w-1/2 p-6 md:p-12">
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-foreground/50 hover:text-foreground transition-colors lg:hidden">
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>
        
        <div className="w-full max-w-[420px] animate-in slide-in-from-bottom-4 fade-in duration-700 ease-out">
          {children}
        </div>
      </div>
      
    </div>
  );
}