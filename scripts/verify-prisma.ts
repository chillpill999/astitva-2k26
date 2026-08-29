import { prisma } from "../lib/prisma";

async function main() {
  try {
    const userCount = await prisma.user.count();
    console.log(`✅ Connected (Found ${userCount} users in Prisma Postgres)`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Connection failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
