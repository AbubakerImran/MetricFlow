import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { token } = await req.json();
    if (!token) return NextResponse.json({ error: "Token required" }, { status: 400 });

    const invite = await prisma.organizationMember.findUnique({
      where: { inviteToken: token },
    });

    if (!invite || invite.inviteAccepted) {
      return NextResponse.json({ error: "Invalid or already accepted invitation" }, { status: 400 });
    }

    await prisma.organizationMember.update({
      where: { id: invite.id },
      data: { userId: session.user.id, inviteAccepted: true, inviteToken: null },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
