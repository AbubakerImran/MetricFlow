import { PricingCards } from "@/components/marketing/pricing-cards";
import { Check, Minus } from "lucide-react";

const comparisonFeatures = [
  { feature: "Projects", free: "1", pro: "10", enterprise: "Unlimited" },
  { feature: "Events/month", free: "1,000", pro: "100,000", enterprise: "Unlimited" },
  { feature: "Data retention", free: "7 days", pro: "1 year", enterprise: "Unlimited" },
  { feature: "Team members", free: "1", pro: "10", enterprise: "Unlimited" },
  { feature: "API access", free: false, pro: true, enterprise: true },
  { feature: "CSV export", free: false, pro: true, enterprise: true },
  { feature: "PDF reports", free: false, pro: true, enterprise: true },
  { feature: "Custom dashboards", free: false, pro: true, enterprise: true },
  { feature: "Priority support", free: false, pro: true, enterprise: true },
  { feature: "SSO / SAML", free: false, pro: false, enterprise: true },
  { feature: "Dedicated support", free: false, pro: false, enterprise: true },
  { feature: "SLA guarantee", free: false, pro: false, enterprise: true },
];

function CellValue({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value ? <Check className="h-5 w-5 text-emerald-500 mx-auto" /> : <Minus className="h-5 w-5 text-muted-foreground mx-auto" />;
  }
  return <span>{value}</span>;
}

export default function PricingPage() {
  return (
    <div className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold md:text-5xl">Pricing</h1>
          <p className="mt-4 text-lg text-muted-foreground">Choose the plan that fits your needs.</p>
        </div>
        <PricingCards />
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Feature comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 pr-4 font-medium">Feature</th>
                  <th className="text-center py-3 px-4 font-medium">Free</th>
                  <th className="text-center py-3 px-4 font-medium">Pro</th>
                  <th className="text-center py-3 px-4 font-medium">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row) => (
                  <tr key={row.feature} className="border-b">
                    <td className="py-3 pr-4">{row.feature}</td>
                    <td className="text-center py-3 px-4"><CellValue value={row.free} /></td>
                    <td className="text-center py-3 px-4"><CellValue value={row.pro} /></td>
                    <td className="text-center py-3 px-4"><CellValue value={row.enterprise} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
