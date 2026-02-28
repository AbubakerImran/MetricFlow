"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 text-sm font-bold text-white">
        MF
      </div>
      {showText && <span className="text-xl font-bold">MetricFlow</span>}
    </Link>
  );
}
