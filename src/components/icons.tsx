"use client";

import * as React from "react";

export function TechiciousLogo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center font-bold ${className || ""}`}>
      <span className="text-2xl tracking-tight text-black dark:text-white">
        Techi
      </span>
      <span className="text-2xl tracking-tight text-black dark:text-white">
        cious
      </span>
    </div>
  );
}
