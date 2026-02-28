import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.organizationId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.memberRole !== "ADMIN") return NextResponse.json({ error: "Only admins can manage billing" }, { status: 403 });

    const { priceId } = await req.json();
    if (!priceId) return NextResponse.json({ error: "Price ID required" }, { status: 400 });

    const org = await prisma.organization.findUnique({
      where: { id: session.user.organizationId },
    });

    if (!org) return NextResponse.json({ error: "Organization not found" }, { status: 404 });

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.APP_URL}/dashboard/settings?tab=billing&success=true`,
      cancel_url: `${process.env.APP_URL}/dashboard/settings?tab=billing`,
      metadata: { organizationId: org.id },
      customer: org.stripeCustomerId || undefined,
    });

    return NextResponse.json({ success: true, data: { url: checkoutSession.url } });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
