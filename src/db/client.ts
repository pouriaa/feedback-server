/**
 * Prisma Client singleton for database access
 *
 * Uses SQLite for local development. The database file is stored at
 * server/prisma/dev.db and is git-ignored.
 */

import { PrismaClient } from "@prisma/client";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set default DATABASE_URL for SQLite if not provided
// Path is relative to the server package root (where prisma folder is)
if (!process.env.DATABASE_URL) {
  const serverRoot = path.resolve(__dirname, "../..");
  const dbPath = path.join(serverRoot, "prisma", "dev.db");
  process.env.DATABASE_URL = `file:${dbPath}`;
}

// Create a singleton Prisma Client instance
// In development, we don't want multiple instances due to hot reloading
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/**
 * Graceful shutdown helper
 */
export async function disconnectDb(): Promise<void> {
  await prisma.$disconnect();
}

/**
 * Connection test helper
 */
export async function testConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("[DB] Connection test failed:", error);
    return false;
  }
}
