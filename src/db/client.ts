/**
 * Prisma Client singleton for database access
 *
 * Supports two modes:
 * 1. Local development: SQLite with file-based database
 * 2. Cloudflare Workers: D1 with @prisma/adapter-d1
 *
 * The mode is determined by environment:
 * - If D1 binding is available (Workers), uses D1 adapter
 * - Otherwise, uses SQLite with file-based DATABASE_URL
 */

import { PrismaClient } from "@prisma/client";

// Check if we're running in Cloudflare Workers environment
const isWorkersEnvironment = typeof (globalThis as any).caches !== "undefined" &&
  typeof (globalThis as any).caches.default !== "undefined";

// Global storage for Prisma client (singleton pattern)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  d1Binding: unknown | undefined;
};

/**
 * Initialize Prisma client for local development (Node.js with SQLite)
 */
async function initLocalPrisma(): Promise<PrismaClient> {
  // Dynamic import for Node.js-only modules
  const { fileURLToPath } = await import("url");
  const path = await import("path");

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Set default DATABASE_URL for SQLite if not provided
  if (!process.env.DATABASE_URL) {
    const serverRoot = path.resolve(__dirname, "../..");
    const dbPath = path.join(serverRoot, "prisma", "dev.db");
    process.env.DATABASE_URL = `file:${dbPath}`;
  }

  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });
}

/**
 * Initialize Prisma client for Cloudflare Workers (D1)
 */
async function initWorkersPrisma(d1Binding: unknown): Promise<PrismaClient> {
  // Dynamic import for D1 adapter (only available in Workers)
  const { PrismaD1 } = await import("@prisma/adapter-d1");
  const adapter = new PrismaD1(d1Binding as D1Database);
  return new PrismaClient({ adapter });
}

/**
 * Set the D1 database binding for Workers environment
 * Must be called before getPrisma() in Workers
 */
export function setD1Binding(binding: unknown): void {
  globalForPrisma.d1Binding = binding;
  // Reset prisma client to force re-initialization with D1
  globalForPrisma.prisma = undefined;
}

/**
 * Get the Prisma client instance
 *
 * In Workers environment, setD1Binding() must be called first.
 * In local development, automatically uses SQLite.
 */
export function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    throw new Error(
      "[DB] Prisma client not initialized. Call initializePrisma() first."
    );
  }
  return globalForPrisma.prisma;
}

/**
 * Initialize Prisma client (async initialization)
 * Call this at app startup before handling requests
 */
export async function initializePrisma(): Promise<PrismaClient> {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  if (isWorkersEnvironment && globalForPrisma.d1Binding) {
    globalForPrisma.prisma = await initWorkersPrisma(globalForPrisma.d1Binding);
  } else {
    globalForPrisma.prisma = await initLocalPrisma();
  }

  return globalForPrisma.prisma;
}

// For backwards compatibility, export a proxy that lazily initializes
// This allows existing code using `prisma` directly to work
let prismaProxy: PrismaClient | null = null;

// Create the prisma export as a lazy-initialized singleton
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (!globalForPrisma.prisma) {
      // For local development, synchronously create the client
      // This maintains backwards compatibility with existing code
      if (!isWorkersEnvironment) {
        // Inline synchronous initialization for Node.js
        if (!process.env.DATABASE_URL) {
          // Use dynamic import workaround
          const url = new URL(import.meta.url);
          const dirname = url.pathname.substring(0, url.pathname.lastIndexOf('/'));
          const dbPath = dirname + "/../../prisma/dev.db";
          process.env.DATABASE_URL = `file:${dbPath}`;
        }
        globalForPrisma.prisma = new PrismaClient({
          log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
        });
      } else {
        throw new Error(
          "[DB] In Workers environment, call initializePrisma() before accessing prisma"
        );
      }
    }
    return (globalForPrisma.prisma as any)[prop];
  },
});

/**
 * Graceful shutdown helper
 */
export async function disconnectDb(): Promise<void> {
  if (globalForPrisma.prisma) {
    await globalForPrisma.prisma.$disconnect();
    globalForPrisma.prisma = undefined;
  }
}

/**
 * Connection test helper
 */
export async function testConnection(): Promise<boolean> {
  try {
    const client = getPrisma();
    await client.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("[DB] Connection test failed:", error);
    return false;
  }
}
