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
/**
 * Set the D1 database binding for Workers environment
 * Must be called before getPrisma() in Workers
 */
export declare function setD1Binding(binding: unknown): void;
/**
 * Get the Prisma client instance
 *
 * In Workers environment, setD1Binding() must be called first.
 * In local development, automatically uses SQLite.
 */
export declare function getPrisma(): PrismaClient;
/**
 * Initialize Prisma client (async initialization)
 * Call this at app startup before handling requests
 */
export declare function initializePrisma(): Promise<PrismaClient>;
export declare const prisma: PrismaClient;
/**
 * Graceful shutdown helper
 */
export declare function disconnectDb(): Promise<void>;
/**
 * Connection test helper
 */
export declare function testConnection(): Promise<boolean>;
//# sourceMappingURL=client.d.ts.map