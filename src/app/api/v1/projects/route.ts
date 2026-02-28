import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function validateApiKey(req: Request) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) return null;

  const key = await prisma.apiKey.findUnique({
    where: { key: apiKey },
    include: { organization: true },
  });

  if (!key) return null;
  if (key.expiresAt && key.expiresAt < new Date()) return null;

  await prisma.apiKey.update({ where: { id: key.id }, data: { lastUsedAt: new Date() } });
  return key;
}

export async function GET(req: Request) {
  try {
    const key = await validateApiKey(req);
    if (!key) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });

    const projects = await prisma.project.findMany({
      where: { organizationId: key.organizationId },
      include: { _count: { select: { events: true, metrics: true } } },
    });

    return NextResponse.json({ success: true, data: projects });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
