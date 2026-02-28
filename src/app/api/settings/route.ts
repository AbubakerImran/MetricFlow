import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.organizationId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const org = await prisma.organization.findUnique({
      where: { id: session.user.organizationId },
    });

    return NextResponse.json({ success: true, data: org });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const updateSchema = z.object({
  name: z.string().min(2).optional(),
});

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.organizationId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.memberRole !== "ADMIN") return NextResponse.json({ error: "Only admins can update settings" }, { status: 403 });

    const body = await req.json();
    const data = updateSchema.parse(body);

    const org = await prisma.organization.update({
      where: { id: session.user.organizationId },
      data,
    });

    return NextResponse.json({ success: true, data: org });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
