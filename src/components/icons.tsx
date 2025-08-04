import * as React from "react";

export function FinSightLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
    >
      <title>FinSight Logo</title>
      <path
        d="M20 80 C40 40, 60 40, 80 80"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      />
      <path
        d="M30 80 Q50 60, 70 80"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-accent"
      />
      <circle cx="50" cy="30" r="10" className="text-primary" />
    </svg>
  );
}
