export function SkillBridgeLogoIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Book base */}
      <rect x="8" y="20" width="20" height="28" rx="4" fill="currentColor" opacity="0.3" />
      <rect x="36" y="20" width="20" height="28" rx="4" fill="currentColor" opacity="0.3" />

      {/* Bridge arc */}
      <path
        d="M20 28C28 10 44 10 52 28"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Nodes / people */}
      <circle cx="20" cy="28" r="3" fill="currentColor" />
      <circle cx="52" cy="28" r="3" fill="currentColor" />

      {/* Skill spark */}
      <path
        d="M32 14L34 19L39 20L34 22L32 27L30 22L25 20L30 19Z"
        fill="currentColor"
      />
    </svg>
  );
}
