// ============================================================================
// ASTITVA 2K26 - Production-Grade Prisma Client Singleton with PrismaPg Adapter
// ============================================================================

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;
  if (connectionString && !connectionString.includes("localhost:5432")) {
    const pool = new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prismaGlobal: PrismaClientSingleton | undefined;
};

if (!globalForPrisma.prismaGlobal) {
  globalForPrisma.prismaGlobal = prismaClientSingleton();
}

export const prisma = globalForPrisma.prismaGlobal;

export default prisma;

