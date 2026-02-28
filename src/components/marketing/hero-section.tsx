import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent" />
      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full border px-4 py-1.5 text-sm">
            <Zap className="mr-2 h-4 w-4 text-indigo-500" />
            <span>Trusted by 2,000+ companies worldwide</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500 bg-clip-text text-transparent">
              Analytics That
            </span>
            <br />
            Drive Decisions
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
            Track, visualize, and optimize your SaaS metrics in real-time. Make data-driven decisions with beautiful dashboards and powerful insights.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700" asChild>
              <Link href="/auth/signup">Start Free Trial <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/docs">View Documentation</Link>
            </Button>
          </div>
        </div>
        <div className="mt-16 mx-auto max-w-5xl">
          <div className="relative rounded-xl border bg-card p-2 shadow-2xl shadow-indigo-500/10">
            <div className="rounded-lg bg-zinc-900 p-6 md:p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Total Revenue", value: "$48,290", change: "+12.5%" },
                  { label: "Active Users", value: "2,847", change: "+8.2%" },
                  { label: "Sessions", value: "12,493", change: "+15.3%" },
                  { label: "Conversion", value: "3.24%", change: "+0.4%" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg bg-zinc-800 p-4">
                    <p className="text-xs text-zinc-400">{stat.label}</p>
                    <p className="text-lg font-bold text-white mt-1">{stat.value}</p>
                    <p className="text-xs text-emerald-400">{stat.change}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-5 w-5 text-indigo-400" />
                <span className="text-sm text-zinc-300 font-medium">Revenue Overview</span>
              </div>
              <div className="h-48 flex items-end gap-1">
                {[40, 55, 35, 65, 50, 75, 45, 85, 60, 90, 70, 95].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-indigo-600 to-blue-500 transition-all" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-x-0 -bottom-10 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
