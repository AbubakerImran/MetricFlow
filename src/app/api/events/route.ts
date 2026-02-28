import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.organizationId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const type = searchParams.get("type");
    const projectId = searchParams.get("projectId");

    const where = {
      project: { organizationId: session.user.organizationId },
      ...(type ? { type: type as "PAGE_VIEW" | "SIGN_UP" | "PURCHASE" | "CLICK" | "CUSTOM" } : {}),
      ...(projectId ? { projectId } : {}),
    };

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { timestamp: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.event.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: events,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const createSchema = z.object({
  name: z.string(),
  type: z.enum(["PAGE_VIEW", "SIGN_UP", "PURCHASE", "CLICK", "CUSTOM"]),
  projectId: z.string(),
  description: z.string().optional(),
  properties: z.record(z.string(), z.unknown()).optional(),
  revenue: z.number().optional(),
  userId_external: z.string().optional(),
  country: z.string().optional(),
  device: z.string().optional(),
  browser: z.string().optional(),
  referrer: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.organizationId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.memberRole === "VIEWER") return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });

    const body = await req.json();
    const parsed = createSchema.parse(body);

    const event = await prisma.event.create({
      data: {
        name: parsed.name,
        type: parsed.type,
        projectId: parsed.projectId,
        description: parsed.description,
        properties: (parsed.properties as Prisma.InputJsonValue) ?? undefined,
        revenue: parsed.revenue,
        userId_external: parsed.userId_external,
        country: parsed.country,
        device: parsed.device,
        browser: parsed.browser,
        referrer: parsed.referrer,
      },
    });

    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0]?.message || "Validation failed" }, { status: 400 });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
