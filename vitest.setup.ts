/**
 * Vitest Setup File
 *
 * Initializes Prisma client and test database before running tests.
 * Creates a test project with a known API key for integration tests.
 */

import { beforeAll, afterAll, beforeEach } from "vitest";
import { initializePrisma, disconnectDb, getPrisma } from "./src/db/index.js";
import { TEST_API_KEY, TEST_PROJECT_ID } from "./src/__tests__/helpers.js";

// Set test database URL and admin key
process.env.DATABASE_URL = "file:./prisma/test.db";
process.env.ADMIN_API_KEY = "test-admin-key";

beforeAll(async () => {
  // Initialize Prisma client for tests
  await initializePrisma();

  const prisma = getPrisma();

  // Clean up any existing test data (order matters due to foreign keys)
  await prisma.feedback.deleteMany({});
  await prisma.snapshot.deleteMany({});
  await prisma.allowedOrigin.deleteMany({});
  await prisma.project.deleteMany({});

  // Create a test project with a known API key (use upsert to avoid conflicts)
  await prisma.project.upsert({
    where: { id: TEST_PROJECT_ID },
    update: {
      name: "Test Project",
      apiKey: TEST_API_KEY,
    },
    create: {
      id: TEST_PROJECT_ID,
      name: "Test Project",
      apiKey: TEST_API_KEY,
      allowedOrigins: {
        create: [
          { origin: "https://example.com" },
        ],
      },
    },
  });
});

beforeEach(async () => {
  // Ensure test project exists before each test
  const prisma = getPrisma();
  
  // Upsert the test project to make sure it exists
  await prisma.project.upsert({
    where: { id: TEST_PROJECT_ID },
    update: {},
    create: {
      id: TEST_PROJECT_ID,
      name: "Test Project",
      apiKey: TEST_API_KEY,
      allowedOrigins: {
        create: [{ origin: "https://example.com" }],
      },
    },
  });
});

afterAll(async () => {
  // Disconnect from database after tests
  await disconnectDb();
});
