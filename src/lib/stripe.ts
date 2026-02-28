import Stripe from "stripe";

let _stripe: Stripe | undefined;

function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY environment variable is not set.");
    }
    _stripe = new Stripe(key, {
      typescript: true,
    });
  }
  return _stripe;
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    if (prop === "then") return undefined;
    return Reflect.get(getStripe(), prop);
  },
});

export const PLANS = {
  FREE: { name: "Free", price: 0, projects: 1, events: 1000, members: 1, retention: "7 days", api: false },
  PRO: { name: "Pro", price: 29, projects: 10, events: 100000, members: 10, retention: "1 year", api: true },
  ENTERPRISE: { name: "Enterprise", price: 99, projects: -1, events: -1, members: -1, retention: "Unlimited", api: true },
} as const;
