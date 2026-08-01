import Link from "next/link";
import { Twitter, Github, Linkedin } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const cols = [
    {
      heading: "Product",
      links: [
        { label: "Browse Tutors", href: "/tutors" },
        { label: "How it Works", href: "/#how-it-works" },
        { label: "Pricing", href: "/pricing" },
        { label: "Sign Up", href: "/register" },
      ],
    },
    {
      heading: "Resources",
      links: [
        { label: "Help Center", href: "#" },
        { label: "Community", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Success Stories", href: "#" },
      ],
    },
    {
      heading: "Legal",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Cookie Policy", href: "#" },
      ],
    },
  ];

  return (
    <footer className="w-full border-t border-foreground/[0.07] bg-background">
      <div className="container mx-auto px-5 md:px-10 pt-20 pb-10">

        {/* Top grid */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 mb-16">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-5 space-y-6">
            <Logo />
            <p className="text-sm leading-relaxed text-foreground/50 max-w-xs">
              Elevate your potential with world-class mentors. Master your craft anywhere, anytime — with the industry&apos;s top minds at your side.
            </p>
            <div className="flex items-center gap-3">
              {[
                { Icon: Twitter, href: "#", label: "Twitter" },
                { Icon: Github, href: "#", label: "GitHub" },
                { Icon: Linkedin, href: "#", label: "LinkedIn" },
              ].map(({ Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/[0.08] text-foreground/40 transition-all duration-300 hover:border-primary/30 hover:bg-primary/[0.06] hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.heading} className="lg:col-span-2">
              <h3 className="mb-5 text-[11px] font-bold tracking-[0.12em] text-foreground/40 uppercase">
                {col.heading}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-foreground/55 transition-colors duration-200 hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* CTA column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="mb-5 text-[11px] font-bold tracking-[0.12em] text-foreground/40 uppercase">
              Contact
            </h3>
            <a
              href="mailto:hello@skillbridge.com"
              className="group inline-flex items-center gap-2 rounded-full border border-foreground/10 px-5 py-2.5 text-sm font-semibold text-foreground/70 transition-all duration-300 hover:border-primary/30 hover:bg-primary/[0.06] hover:text-primary"
            >
              Email us
              <svg
                width="14" height="14" viewBox="0 0 14 14" fill="none"
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              >
                <path d="M2 12L12 2M12 2H5M12 2v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col-reverse gap-4 items-center justify-between border-t border-foreground/[0.07] pt-8 sm:flex-row">
          <p className="text-xs font-medium text-foreground/35">
            © {currentYear} SkillBridge Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            {/* Tiny logo mark */}
            <svg width="16" height="16" viewBox="0 0 48 48" fill="none" className="opacity-30">
              <path d="M8 36 Q8 16 24 14 Q40 16 40 36" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              <line x1="8" y1="36" x2="40" y2="36" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            <p className="text-xs font-medium text-foreground/35">
              Built for learners worldwide.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}