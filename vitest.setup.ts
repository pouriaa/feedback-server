/**
 * Vitest setup for server integration tests
 *
 * - Sets DATABASE_URL to use a separate test database
 * - Clears tables between tests for isolation
 * - Disconnects Prisma after all tests complete
 */

import path from "path";
import { fileURLToPath } from "url";

// Set DATABASE_URL to test database BEFORE any other imports
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testDbPath = path.join(__dirname, "prisma", "test.db");
process.env.DATABASE_URL = `file:${testDbPath}`;

// Use dynamic import to ensure DATABASE_URL is set first
const { prisma, disconnectDb } = await import("./src/db/index.js");

beforeAll(async () => {
  // Clear all tables once before running any tests
  // Each test uses unique session IDs, so we don't need per-test cleanup
  await prisma.feedback.deleteMany();
  await prisma.snapshot.deleteMany();
});

afterAll(async () => {
  // Clean up and disconnect Prisma after all tests
  await prisma.feedback.deleteMany();
  await prisma.snapshot.deleteMany();
  await disconnectDb();
});

