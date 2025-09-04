"use client";

import * as React from "react";

export function TechiciousLogo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center font-bold ${className || ""}`}>
      <span className="text-2xl tracking-tight text-primary">Techi</span>
      <span className="text-2xl tracking-tight text-gray-800 dark:text-gray-200">
        cious
      </span>
    </div>
  );
}
