import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // optionally set log/query options in dev
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
