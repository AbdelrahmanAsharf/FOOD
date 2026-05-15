import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";   // لو Postgres

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// إنشاء الـ Adapter
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,        // مهم جداً
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}