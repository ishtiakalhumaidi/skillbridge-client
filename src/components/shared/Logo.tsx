import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group flex items-center gap-3 transition-all ${className}`}>
      <div className="relative flex h-10 w-10 items-center justify-center transition-transform duration-500 group-hover:scale-105">
        <svg 
          viewBox="0 0 40 40" 
          className="h-10 w-10 transition-all duration-500 group-hover:drop-shadow-[0_0_8px_rgba(37,99,235,0.5)]"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="skillbridge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className="transition-all duration-500" style={{ stopColor: '#3b82f6' }} />
              <stop offset="100%" className="transition-all duration-500" style={{ stopColor: '#8b5cf6' }} />
            </linearGradient>
            <linearGradient id="skillbridge-grad-hover" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className="transition-all duration-500" style={{ stopColor: '#2563eb' }} />
              <stop offset="100%" className="transition-all duration-500" style={{ stopColor: '#7c3aed' }} />
            </linearGradient>
          </defs>
          
          <path 
            d="M6 12 L6 30 C6 30 12 28 20 28 C28 28 34 30 34 30 L34 12 C34 12 28 10 20 10 C12 10 6 12 6 12Z" 
            fill="url(#skillbridge-grad)"
            className="transition-all duration-500 group-hover:fill-[url(#skillbridge-grad-hover)]"
            opacity="0.9"
          />
          
          <path 
            d="M20 10 L20 28" 
            stroke="white" 
            strokeWidth="1.5" 
            opacity="0.4"
            strokeLinecap="round"
          />
          
    
          <line x1="10" y1="16" x2="18" y2="16" stroke="white" strokeWidth="1.2" opacity="0.6" strokeLinecap="round"/>
          <line x1="10" y1="19" x2="17" y2="19" stroke="white" strokeWidth="1.2" opacity="0.6" strokeLinecap="round"/>
          <line x1="10" y1="22" x2="18" y2="22" stroke="white" strokeWidth="1.2" opacity="0.6" strokeLinecap="round"/>
          
          {/* Right page lines */}
          <line x1="22" y1="16" x2="30" y2="16" stroke="white" strokeWidth="1.2" opacity="0.6" strokeLinecap="round"/>
          <line x1="23" y1="19" x2="30" y2="19" stroke="white" strokeWidth="1.2" opacity="0.6" strokeLinecap="round"/>
          <line x1="22" y1="22" x2="30" y2="22" stroke="white" strokeWidth="1.2" opacity="0.6" strokeLinecap="round"/>
      
          <path 
            d="M 8 8 Q 20 2 32 8" 
            stroke="url(#skillbridge-grad)" 
            strokeWidth="2.5" 
            fill="none"
            strokeLinecap="round"
            className="transition-all duration-500 group-hover:stroke-[url(#skillbridge-grad-hover)] group-hover:drop-shadow-[0_0_4px_rgba(59,130,246,0.6)]"
          />
          
          <circle cx="8" cy="8" r="2.5" fill="#3b82f6" className="transition-all duration-500 group-hover:fill-[#2563eb]"/>
          <circle cx="20" cy="2.8" r="2.5" fill="#8b5cf6" className="transition-all duration-500 group-hover:fill-[#7c3aed]"/>
          <circle cx="32" cy="8" r="2.5" fill="#3b82f6" className="transition-all duration-500 group-hover:fill-[#2563eb]"/>
          
      
          <g className="transition-all duration-700 group-hover:scale-110 origin-center" style={{ transformOrigin: '32px 26px' }}>
            <path 
              d="M32 24 L32.5 25.5 L34 26 L32.5 26.5 L32 28 L31.5 26.5 L30 26 L31.5 25.5 Z" 
              fill="#fbbf24"
              className="transition-all duration-500 group-hover:fill-[#f59e0b]"
            />
          </g>
        </svg>
      </div>
      <span className="font-head text-2xl tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
        SkillBridge
      </span>
    </Link>
  );
}