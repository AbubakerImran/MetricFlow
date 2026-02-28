import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const member = await prisma.organizationMember.findFirst({
      where: { userId: session.user.id },
      include: { organization: true },
    });

    if (!member) return NextResponse.json({ error: "No organization found" }, { status: 404 });

    return NextResponse.json({ success: true, data: member.organization });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const createSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, slug } = createSchema.parse(body);

    const org = await prisma.organization.create({
      data: {
        name,
        slug,
        members: {
          create: { userId: session.user.id, role: "ADMIN", inviteAccepted: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: org });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0]?.message || "Validation failed" }, { status: 400 });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
