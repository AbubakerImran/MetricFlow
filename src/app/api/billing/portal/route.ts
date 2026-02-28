import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.organizationId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const org = await prisma.organization.findUnique({
      where: { id: session.user.organizationId },
    });

    if (!org?.stripeCustomerId) return NextResponse.json({ error: "No billing account" }, { status: 400 });

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: org.stripeCustomerId,
      return_url: `${process.env.APP_URL}/dashboard/settings?tab=billing`,
    });

    return NextResponse.json({ success: true, data: { url: portalSession.url } });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
