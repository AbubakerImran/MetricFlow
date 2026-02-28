import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2026-02-25.clover",
  typescript: true,
});

export const PLANS = {
  FREE: { name: "Free", price: 0, projects: 1, events: 1000, members: 1, retention: "7 days", api: false },
  PRO: { name: "Pro", price: 29, projects: 10, events: 100000, members: 10, retention: "1 year", api: true },
  ENTERPRISE: { name: "Enterprise", price: 99, projects: -1, events: -1, members: -1, retention: "Unlimited", api: true },
} as const;
