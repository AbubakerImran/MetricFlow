import { HeroSection } from "@/components/marketing/hero-section";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, LayoutDashboard, Download, Code, CreditCard, ArrowRight } from "lucide-react";
import Link from "next/link";

const features = [
  { icon: BarChart3, title: "Real-Time Analytics", description: "Track your metrics as they happen with live-updating dashboards and instant insights." },
  { icon: Users, title: "Team Collaboration", description: "Invite your team with role-based access control. Admins, editors, and viewers." },
  { icon: LayoutDashboard, title: "Custom Dashboards", description: "Build beautiful dashboards with drag-and-drop charts and customizable widgets." },
  { icon: Download, title: "Data Export", description: "Export your data to CSV or PDF with one click. Share reports with stakeholders." },
  { icon: Code, title: "API Access", description: "Full REST API with authentication. Track events from any platform or service." },
  { icon: CreditCard, title: "Stripe Billing", description: "Seamless subscription management with Stripe. Upgrade, downgrade, or cancel anytime." },
];

const steps = [
  { step: "01", title: "Connect", description: "Integrate MetricFlow with your app using our simple API or SDK." },
  { step: "02", title: "Visualize", description: "Watch your data come to life with real-time charts and dashboards." },
  { step: "03", title: "Decide", description: "Make data-driven decisions with actionable insights and reports." },
];

const testimonials = [
  { quote: "MetricFlow transformed how we track our SaaS metrics. The real-time dashboards are incredible.", author: "Sarah Chen", role: "CEO, TechStart", avatar: "SC" },
  { quote: "Finally an analytics platform that's both powerful and easy to use. Our team adopted it in days.", author: "Marcus Johnson", role: "VP Engineering, DataFlow", avatar: "MJ" },
  { quote: "The API access and export features save us hours every week. Best analytics tool we've used.", author: "Emily Rodriguez", role: "Head of Growth, ScaleUp", avatar: "ER" },
];

const faqs = [
  { q: "How does the free trial work?", a: "Start with our Free plan — no credit card required. You get 1 project, 1,000 events/month, and 7-day data retention. Upgrade anytime." },
  { q: "Can I change my plan later?", a: "Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated." },
  { q: "What payment methods do you accept?", a: "We accept all major credit cards through Stripe. Enterprise customers can also pay via invoice." },
  { q: "Is my data secure?", a: "Yes. We use industry-standard encryption, SOC 2 compliant infrastructure, and never share your data with third parties." },
  { q: "Do you offer a self-hosted option?", a: "Enterprise plans include the option for self-hosted deployment. Contact our sales team for details." },
  { q: "What kind of support do you offer?", a: "Free plans get community support. Pro plans get priority email support. Enterprise gets dedicated support with SLA." },
];

export default function LandingPage() {
  return (
    <div>
      <HeroSection />

      {/* Trusted By */}
      <section className="border-y bg-muted/30 py-12">
        <div className="container">
          <p className="text-center text-sm text-muted-foreground mb-8">Trusted by innovative companies worldwide</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-50">
            {["Vercel", "Stripe", "Notion", "Linear", "Figma", "GitHub"].map((name) => (
              <span key={name} className="text-xl font-bold text-muted-foreground">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-28">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold md:text-4xl">Everything you need to grow</h2>
            <p className="mt-4 text-muted-foreground text-lg">Powerful analytics tools designed for modern SaaS teams.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {features.map((f) => (
              <Card key={f.title} className="group hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                <CardContent className="pt-6">
                  <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-indigo-500/10 p-2.5">
                    <f.icon className="h-5 w-5 text-indigo-500" />
                  </div>
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold md:text-4xl">How it works</h2>
            <p className="mt-4 text-muted-foreground text-lg">Get started in minutes, not days.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            {steps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="mb-4 inline-flex items-center justify-center h-12 w-12 rounded-full bg-indigo-600 text-white font-bold text-sm">{s.step}</div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold md:text-4xl">Loved by teams everywhere</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {testimonials.map((t) => (
              <Card key={t.author}>
                <CardContent className="pt-6">
                  <p className="text-sm italic mb-4">&quot;{t.quote}&quot;</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-sm font-semibold text-indigo-500">{t.avatar}</div>
                    <div>
                      <p className="text-sm font-semibold">{t.author}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold md:text-4xl">Simple, transparent pricing</h2>
            <p className="mt-4 text-muted-foreground text-lg">Start free, scale as you grow.</p>
          </div>
          <PricingCards />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold md:text-4xl">Frequently asked questions</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container">
          <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 p-12 text-center text-white">
            <h2 className="text-3xl font-bold md:text-4xl mb-4">Ready to get started?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">Join 2,000+ companies already using MetricFlow to drive growth.</p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth/signup">Start Free Trial <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
