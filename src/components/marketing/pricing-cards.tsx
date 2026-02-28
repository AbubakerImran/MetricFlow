"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    description: "Perfect for getting started",
    monthlyPrice: 0,
    annualPrice: 0,
    features: ["1 project", "1,000 events/month", "7-day data retention", "Basic charts", "1 team member", "Community support"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    description: "For growing teams",
    monthlyPrice: 29,
    annualPrice: 23,
    features: ["10 projects", "100,000 events/month", "1-year data retention", "Advanced charts & exports", "10 team members", "API access", "Priority support", "CSV & PDF exports"],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For large organizations",
    monthlyPrice: 99,
    annualPrice: 79,
    features: ["Unlimited projects", "Unlimited events", "Unlimited data retention", "All chart types", "Unlimited team members", "Full API access", "SSO & SAML", "Dedicated support", "Custom integrations", "SLA guarantee"],
    cta: "Contact Sales",
    popular: false,
  },
];

export function PricingCards() {
  const [annual, setAnnual] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-center gap-3 mb-10">
        <span className={cn("text-sm", !annual && "font-semibold")}>Monthly</span>
        <button
          onClick={() => setAnnual(!annual)}
          className={cn("relative inline-flex h-6 w-11 items-center rounded-full transition-colors", annual ? "bg-indigo-600" : "bg-zinc-300 dark:bg-zinc-700")}
        >
          <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white transition-transform", annual ? "translate-x-6" : "translate-x-1")} />
        </button>
        <span className={cn("text-sm", annual && "font-semibold")}>Annual</span>
        {annual && <Badge variant="secondary" className="text-xs">Save 20%</Badge>}
      </div>
      <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
        {plans.map((plan) => {
          const price = annual ? plan.annualPrice : plan.monthlyPrice;
          return (
            <Card key={plan.name} className={cn("relative flex flex-col", plan.popular && "border-indigo-500 shadow-lg shadow-indigo-500/10")}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-indigo-600">Most Popular</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-bold">${price}</span>
                  {price > 0 && <span className="text-muted-foreground">/month</span>}
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className={cn("w-full", plan.popular && "bg-indigo-600 hover:bg-indigo-700")} variant={plan.popular ? "default" : "outline"} asChild>
                  <Link href="/auth/signup">{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
