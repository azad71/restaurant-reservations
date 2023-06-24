import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  db: PrismaClient | undefined;
};

const db = globalForPrisma.db ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.db = db;

export default db;
