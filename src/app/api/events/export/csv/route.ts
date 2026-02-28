import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Papa from "papaparse";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.organizationId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.memberRole === "VIEWER") return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });

    const events = await prisma.event.findMany({
      where: { project: { organizationId: session.user.organizationId } },
      orderBy: { timestamp: "desc" },
      take: 10000,
    });

    const csv = Papa.unparse(events.map((e: { id: string; name: string; type: string; revenue: number | null; country: string | null; device: string | null; browser: string | null; referrer: string | null; timestamp: Date }) => ({
      id: e.id,
      name: e.name,
      type: e.type,
      revenue: e.revenue,
      country: e.country,
      device: e.device,
      browser: e.browser,
      referrer: e.referrer,
      timestamp: e.timestamp.toISOString(),
    })));

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="events-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
