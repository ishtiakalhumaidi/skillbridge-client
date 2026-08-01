import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group flex items-center gap-3 transition-all ${className}`}>
      <div className="transition-transform duration-500 group-hover:scale-105 group-hover:drop-shadow-[0_0_12px_rgba(37,99,235,0.5)]">
        <svg width="44" height="44" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="48" rx="14" fill="#1E3A5F"/>
          {/* bridge arch */}
          <path d="M8 36 Q8 16 24 14 Q40 16 40 36" stroke="#60A5FA" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          {/* bridge pillars */}
          <line x1="16" y1="23" x2="16" y2="36" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" opacity={0.6}/>
          <line x1="32" y1="23" x2="32" y2="36" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" opacity={0.6}/>
          {/* road */}
          <line x1="8" y1="36" x2="40" y2="36" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          {/* pencil */}
          <g transform="translate(28, 6) rotate(45)">
            <rect x="0" y="0" width="6" height="14" rx="1" fill="#FCD34D"/>
            <polygon points="0,14 3,20 6,14" fill="#F5A623"/>
            <rect x="0" y="0" width="6" height="3" rx="1" fill="#9CA3AF"/>
          </g>
        </svg>
      </div>
      <span className="font-head text-2xl tracking-tight text-foreground">
        SkillBridge
      </span>
    </Link>
  );
}