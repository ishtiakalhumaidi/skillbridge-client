import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-mono text-xl font-bold tracking-tight">
                Skill<span className="text-primary">Bridge</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Connecting eager students with expert tutors worldwide. Learn anything, anytime.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/tutors" className="hover:text-primary">Browse Tutors</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-primary">How it Works</Link></li>
              <li><Link href="/register" className="hover:text-primary">Sign Up</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary">Help Center</Link></li>
              <li><Link href="#" className="hover:text-primary">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>support@skillbridge.com</li>
              <li>1-800-TUTOR-ME</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} SkillBridge. All rights reserved.
        </div>
      </div>
    </footer>
  )
}