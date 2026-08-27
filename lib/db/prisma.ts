// ============================================================================
// ASTITVA 2K26 - Production-Grade Prisma Client Singleton
// Path: lib/db/prisma.ts
// ============================================================================

import { PrismaClient } from "@prisma/client";

/**
 * Factory function creating a new configured PrismaClient instance.
 */
const prismaClientSingleton = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    errorFormat: "pretty",
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prismaGlobal: PrismaClientSingleton | undefined;
};

/**
 * Exported Prisma client singleton.
 * Reuses existing instance in development or instantiates fresh in production.
 */
export const prisma = globalForPrisma.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaGlobal = prisma;
}

export default prisma;
