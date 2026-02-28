import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.organizationId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const metrics = await prisma.metric.findMany({
      where: { project: { organizationId: session.user.organizationId } },
      orderBy: { timestamp: "desc" },
      take: 100,
    });

    return NextResponse.json({ success: true, data: metrics });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
