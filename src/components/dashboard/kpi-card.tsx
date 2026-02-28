"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  prefix?: string;
  live?: boolean;
}

export function KPICard({ title, value, change, icon: Icon, prefix, live }: KPICardProps) {
  const isPositive = change >= 0;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              {title}
              {live && <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" /></span>}
            </p>
            <p className="text-2xl font-bold">{prefix}{value}</p>
          </div>
          <div className="rounded-lg bg-indigo-500/10 p-2.5">
            <Icon className="h-5 w-5 text-indigo-500" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1 text-sm">
          {isPositive ? (
            <ArrowUp className="h-4 w-4 text-emerald-500" />
          ) : (
            <ArrowDown className="h-4 w-4 text-red-500" />
          )}
          <span className={cn("font-medium", isPositive ? "text-emerald-500" : "text-red-500")}>
            {Math.abs(change).toFixed(1)}%
          </span>
          <span className="text-muted-foreground">vs last period</span>
        </div>
      </CardContent>
    </Card>
  );
}
