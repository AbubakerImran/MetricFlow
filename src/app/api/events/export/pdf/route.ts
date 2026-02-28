import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jsPDF } from "jspdf";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.organizationId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.memberRole === "VIEWER") return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });

    const events = await prisma.event.findMany({
      where: { project: { organizationId: session.user.organizationId } },
      orderBy: { timestamp: "desc" },
      take: 100,
    });

    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("MetricFlow Analytics Report", 20, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30);
    doc.text(`Total Events: ${events.length}`, 20, 36);

    let y = 50;
    doc.setFontSize(8);
    doc.text("Name", 20, y);
    doc.text("Type", 80, y);
    doc.text("Revenue", 120, y);
    doc.text("Country", 150, y);
    doc.text("Date", 180, y);
    y += 6;

    events.forEach((event) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(event.name.substring(0, 30), 20, y);
      doc.text(event.type, 80, y);
      doc.text(event.revenue?.toString() || "-", 120, y);
      doc.text(event.country || "-", 150, y);
      doc.text(event.timestamp.toISOString().split("T")[0], 180, y);
      y += 5;
    });

    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="report-${new Date().toISOString().split("T")[0]}.pdf"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
