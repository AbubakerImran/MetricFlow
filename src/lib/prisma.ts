import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    // During build time, return a PrismaClient that won't be used
    // This prevents build failures when DATABASE_URL is not set
    return new Proxy({} as PrismaClient, {
      get(_target, prop) {
        if (prop === "then") return undefined;
        throw new Error(
          "PrismaClient is not available. DATABASE_URL environment variable is not set."
        );
      },
    });
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
