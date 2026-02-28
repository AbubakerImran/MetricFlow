"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";

export function MarketingNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <Link href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">Docs</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild><Link href="/auth/signin">Sign In</Link></Button>
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700"><Link href="/auth/signup">Start Free Trial</Link></Button>
        </div>
      </div>
    </header>
  );
}
