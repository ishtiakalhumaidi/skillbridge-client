import Link from "next/link"
import { Twitter, Github, Linkedin, ArrowRight } from "lucide-react"
import { Logo } from "./Logo"

export function Footer() {
  return (
    <footer className="w-full border-t border-foreground/10 bg-background transition-colors duration-700">
      <div className="container mx-auto px-6 md:px-12 py-24">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12 lg:gap-12">
          
          {/* Brand Col */}
          <div className="space-y-8 md:col-span-4 lg:col-span-5">
            <Logo />
            <p className="text-base leading-relaxed text-foreground/60 max-w-sm">
              Elevate your potential with world-class mentors. Master your craft anywhere, anytime, with the industry&apos;s top minds.
            </p>
            <div className="flex gap-5 text-foreground/40">
              <Link href="#" className="hover:text-primary transition-colors"><Twitter className="h-6 w-6" /></Link>
              <Link href="#" className="hover:text-primary transition-colors"><Github className="h-6 w-6" /></Link>
              <Link href="#" className="hover:text-primary transition-colors"><Linkedin className="h-6 w-6" /></Link>
            </div>
          </div>
          
          {/* Links Col 1 */}
          <div className="md:col-span-2 lg:col-span-2">
            <h3 className="mb-6 text-sm font-bold tracking-widest text-foreground uppercase">Product</h3>
            <ul className="space-y-4 text-sm font-medium text-foreground/60">
              <li><Link href="/tutors" className="hover:text-primary transition-colors">Browse Tutors</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-primary transition-colors">How it Works</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/register" className="hover:text-primary transition-colors">Sign Up</Link></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div className="md:col-span-2 lg:col-span-2">
            <h3 className="mb-6 text-sm font-bold tracking-widest text-foreground uppercase">Resources</h3>
            <ul className="space-y-4 text-sm font-medium text-foreground/60">
              <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Community</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Success Stories</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="md:col-span-4 lg:col-span-3">
            <h3 className="mb-6 text-sm font-bold tracking-widest text-foreground uppercase">Contact</h3>
            <ul className="space-y-4 text-sm font-medium text-foreground/60">
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li className="pt-4">
                <a href="mailto:hello@skillbridge.com" className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground/5 px-6 font-semibold text-foreground transition-all hover:bg-primary hover:text-primary-foreground">
                  Contact Support <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-24 flex flex-col items-center justify-between border-t border-foreground/10 pt-10 text-sm font-medium text-foreground/40 md:flex-row">
          <p>© {new Date().getFullYear()} SkillBridge Inc. All rights reserved.</p>
          <p className="mt-4 md:mt-0 flex items-center gap-1">
            Designed for perfection.
          </p>
        </div>
      </div>
    </footer>
  )
}