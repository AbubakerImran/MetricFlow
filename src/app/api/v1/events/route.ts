import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod";

async function validateApiKey(req: Request) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) return null;

  const key = await prisma.apiKey.findUnique({
    where: { key: apiKey },
    include: { organization: true },
  });

  if (!key) return null;
  if (key.expiresAt && key.expiresAt < new Date()) return null;

  await prisma.apiKey.update({
    where: { id: key.id },
    data: { lastUsedAt: new Date() },
  });

  return key;
}

export async function GET(req: Request) {
  try {
    const key = await validateApiKey(req);
    if (!key) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

    const events = await prisma.event.findMany({
      where: { project: { organizationId: key.organizationId } },
      orderBy: { timestamp: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({ success: true, data: events });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const eventSchema = z.object({
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
    const key = await validateApiKey(req);
    if (!key) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });

    // Rate limit check
    if (key.organization.apiRequestCount >= key.organization.apiRateLimit) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const body = await req.json();
    const parsed = eventSchema.parse(body);

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

    await prisma.organization.update({
      where: { id: key.organizationId },
      data: { apiRequestCount: { increment: 1 } },
    });

    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
