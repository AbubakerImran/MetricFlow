import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendTeamInviteEmail } from "@/lib/resend";
import crypto from "crypto";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.organizationId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const members = await prisma.organizationMember.findMany({
      where: { organizationId: session.user.organizationId },
      include: { user: { select: { id: true, name: true, email: true, image: true } } },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ success: true, data: members });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN", "EDITOR", "VIEWER"]),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.organizationId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.memberRole !== "ADMIN") return NextResponse.json({ error: "Only admins can invite" }, { status: 403 });

    const body = await req.json();
    const { email, role } = inviteSchema.parse(body);
    const inviteToken = crypto.randomUUID();

    const org = await prisma.organization.findUnique({ where: { id: session.user.organizationId } });

    const member = await prisma.organizationMember.create({
      data: {
        organizationId: session.user.organizationId,
        userId: session.user.id,
        role,
        invitedEmail: email,
        inviteToken,
        inviteAccepted: false,
      },
    });

    await sendTeamInviteEmail(email, inviteToken, org?.name || "MetricFlow");

    return NextResponse.json({ success: true, data: member });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
