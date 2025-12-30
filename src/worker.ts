/**
 * Cloudflare Workers Entry Point for Product Feedback API
 *
 * This file exports a fetch handler compatible with Cloudflare Workers runtime.
 * It wraps the Express app using the hono/node-server adapter for compatibility.
 */

import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { setD1Binding, initializePrisma } from "./db/index.js";
import { feedbackService } from "./services/FeedbackService.js";
import { snapshotService } from "./services/SnapshotService.js";
import { FeedbackDataSchema, SnapshotDataSchema } from "./types/index.js";
import type { D1Database } from "@cloudflare/workers-types";

// Environment bindings type
interface Env {
  DB: D1Database;
  ADMIN_API_KEY?: string;
  NODE_ENV?: string;
}

// Create Hono app for Workers
const app = new Hono<{ Bindings: Env }>();

// Middleware
app.use("*", logger());
app.use("*", cors());

// Initialize Prisma with D1 binding per request
app.use("*", async (c, next) => {
  setD1Binding(c.env.DB);
  await initializePrisma();
  await next();
});

// Helper to validate API key and get project
type AuthSuccess = { project: any; error?: never; status?: never };
type AuthError = { error: string; status: number; project?: never };
type AuthResult = AuthSuccess | AuthError;

async function validateApiKey(
  apiKey: string | null,
  origin: string | null
): Promise<AuthResult> {
  if (!apiKey) {
    return { error: "API key required", status: 401 };
  }

  const { getPrisma } = await import("./db/index.js");
  const prisma = getPrisma();

  const project = await prisma.project.findUnique({
    where: { apiKey },
    include: { allowedOrigins: true },
  });

  if (!project) {
    return { error: "Invalid API key", status: 401 };
  }

  // Validate origin if present
  if (origin) {
    const isOriginAllowed = project.allowedOrigins.some(
      (o: { origin: string }) => o.origin === origin || o.origin === "*"
    );
    if (!isOriginAllowed) {
      return { error: "Origin not allowed", status: 403 };
    }
  }

  return { project };
}

// Helper to validate admin key
function validateAdminKey(adminKey: string | null, expectedKey: string | undefined): boolean {
  return !!expectedKey && adminKey === expectedKey;
}

// Health check
app.get("/health", async (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "0.0.1",
    environment: c.env.NODE_ENV ?? "production",
  });
});

// POST /feedback - Submit feedback
app.post("/feedback", async (c) => {
  const apiKey = c.req.header("X-API-Key");
  const origin = c.req.header("Origin");

  const auth = await validateApiKey(apiKey ?? null, origin ?? null);
  if ("error" in auth) {
    return c.json({ success: false, error: auth.error }, auth.status as any);
  }

  try {
    const body = await c.req.json();
    const parsed = FeedbackDataSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        {
          success: false,
          error: "Validation failed",
          details: parsed.error.issues.map((i) => ({
            path: i.path,
            message: i.message,
          })),
        },
        400
      );
    }

    const result = await feedbackService.create(parsed.data, auth.project.id);
    return c.json(result);
  } catch (error) {
    console.error("[Worker] Error creating feedback:", error);
    return c.json(
      { success: false, error: "Internal server error" },
      500
    );
  }
});

// GET /feedback/:id
app.get("/feedback/:id", async (c) => {
  const apiKey = c.req.header("X-API-Key");
  const origin = c.req.header("Origin");

  const auth = await validateApiKey(apiKey ?? null, origin ?? null);
  if ("error" in auth) {
    return c.json({ success: false, error: auth.error }, auth.status as any);
  }

  try {
    const feedback = await feedbackService.getById(c.req.param("id"), auth.project.id);
    if (!feedback) {
      return c.json({ success: false, error: "Feedback not found" }, 404);
    }
    return c.json(feedback);
  } catch (error) {
    console.error("[Worker] Error getting feedback:", error);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

// POST /snapshots - Submit snapshot
app.post("/snapshots", async (c) => {
  const apiKey = c.req.header("X-API-Key");
  const origin = c.req.header("Origin");

  const auth = await validateApiKey(apiKey ?? null, origin ?? null);
  if ("error" in auth) {
    return c.json({ success: false, error: auth.error }, auth.status as any);
  }

  try {
    const body = await c.req.json();
    const parsed = SnapshotDataSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        {
          success: false,
          error: "Validation failed",
          details: parsed.error.issues.map((i) => ({
            path: i.path,
            message: i.message,
          })),
        },
        400
      );
    }

    const result = await snapshotService.processSnapshot(parsed.data, auth.project.id);
    return c.json(result);
  } catch (error) {
    console.error("[Worker] Error processing snapshot:", error);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

// GET /snapshots/:id
app.get("/snapshots/:id", async (c) => {
  const apiKey = c.req.header("X-API-Key");
  const origin = c.req.header("Origin");

  const auth = await validateApiKey(apiKey ?? null, origin ?? null);
  if ("error" in auth) {
    return c.json({ success: false, error: auth.error }, auth.status as any);
  }

  try {
    const snapshot = await snapshotService.getById(c.req.param("id"), auth.project.id);
    if (!snapshot) {
      return c.json({ success: false, error: "Snapshot not found" }, 404);
    }
    return c.json(snapshot);
  } catch (error) {
    console.error("[Worker] Error getting snapshot:", error);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

// ========================================
// Project Management API (Admin only)
// ========================================

// POST /projects - Create new project
app.post("/projects", async (c) => {
  const adminKey = c.req.header("X-Admin-Key");
  if (!validateAdminKey(adminKey ?? null, c.env.ADMIN_API_KEY)) {
    return c.json({ success: false, error: "Invalid admin key" }, 401);
  }

  try {
    const body = await c.req.json();
    const { name, allowedOrigins } = body as { name: string; allowedOrigins?: string[] };

    if (!name) {
      return c.json({ success: false, error: "Project name required" }, 400);
    }

    const { getPrisma } = await import("./db/index.js");
    const prisma = getPrisma();

    // Generate API key
    const apiKey = `pf_${crypto.randomUUID().replace(/-/g, "")}`;

    const project = await prisma.project.create({
      data: {
        name,
        apiKey,
        allowedOrigins: {
          create: (allowedOrigins ?? []).map((origin: string) => ({ origin })),
        },
      },
      include: { allowedOrigins: true },
    });

    return c.json({
      success: true,
      project: {
        id: project.id,
        name: project.name,
        apiKey: project.apiKey,
        allowedOrigins: project.allowedOrigins.map((o) => o.origin),
        createdAt: project.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("[Worker] Error creating project:", error);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

// GET /projects/:id
app.get("/projects/:id", async (c) => {
  const adminKey = c.req.header("X-Admin-Key");
  if (!validateAdminKey(adminKey ?? null, c.env.ADMIN_API_KEY)) {
    return c.json({ success: false, error: "Invalid admin key" }, 401);
  }

  try {
    const { getPrisma } = await import("./db/index.js");
    const prisma = getPrisma();

    const project = await prisma.project.findUnique({
      where: { id: c.req.param("id") },
      include: { allowedOrigins: true },
    });

    if (!project) {
      return c.json({ success: false, error: "Project not found" }, 404);
    }

    return c.json({
      success: true,
      project: {
        id: project.id,
        name: project.name,
        apiKey: project.apiKey,
        allowedOrigins: project.allowedOrigins.map((o) => o.origin),
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("[Worker] Error getting project:", error);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

// PATCH /projects/:id
app.patch("/projects/:id", async (c) => {
  const adminKey = c.req.header("X-Admin-Key");
  if (!validateAdminKey(adminKey ?? null, c.env.ADMIN_API_KEY)) {
    return c.json({ success: false, error: "Invalid admin key" }, 401);
  }

  try {
    const body = await c.req.json();
    const { name } = body as { name?: string };

    const { getPrisma } = await import("./db/index.js");
    const prisma = getPrisma();

    const project = await prisma.project.update({
      where: { id: c.req.param("id") },
      data: { name },
      include: { allowedOrigins: true },
    });

    return c.json({
      success: true,
      project: {
        id: project.id,
        name: project.name,
        apiKey: project.apiKey,
        allowedOrigins: project.allowedOrigins.map((o) => o.origin),
        updatedAt: project.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("[Worker] Error updating project:", error);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

// DELETE /projects/:id
app.delete("/projects/:id", async (c) => {
  const adminKey = c.req.header("X-Admin-Key");
  if (!validateAdminKey(adminKey ?? null, c.env.ADMIN_API_KEY)) {
    return c.json({ success: false, error: "Invalid admin key" }, 401);
  }

  try {
    const { getPrisma } = await import("./db/index.js");
    const prisma = getPrisma();

    await prisma.project.delete({
      where: { id: c.req.param("id") },
    });

    return c.json({ success: true });
  } catch (error) {
    console.error("[Worker] Error deleting project:", error);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

// POST /projects/:id/origins - Add allowed origin
app.post("/projects/:id/origins", async (c) => {
  const adminKey = c.req.header("X-Admin-Key");
  if (!validateAdminKey(adminKey ?? null, c.env.ADMIN_API_KEY)) {
    return c.json({ success: false, error: "Invalid admin key" }, 401);
  }

  try {
    const body = await c.req.json();
    const { origin } = body as { origin: string };

    if (!origin) {
      return c.json({ success: false, error: "Origin required" }, 400);
    }

    const { getPrisma } = await import("./db/index.js");
    const prisma = getPrisma();

    const allowedOrigin = await prisma.allowedOrigin.create({
      data: {
        projectId: c.req.param("id"),
        origin,
      },
    });

    return c.json({
      success: true,
      origin: {
        id: allowedOrigin.id,
        origin: allowedOrigin.origin,
        createdAt: allowedOrigin.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("[Worker] Error adding origin:", error);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

// DELETE /projects/:id/origins/:originId
app.delete("/projects/:id/origins/:originId", async (c) => {
  const adminKey = c.req.header("X-Admin-Key");
  if (!validateAdminKey(adminKey ?? null, c.env.ADMIN_API_KEY)) {
    return c.json({ success: false, error: "Invalid admin key" }, 401);
  }

  try {
    const { getPrisma } = await import("./db/index.js");
    const prisma = getPrisma();

    await prisma.allowedOrigin.delete({
      where: { id: c.req.param("originId") },
    });

    return c.json({ success: true });
  } catch (error) {
    console.error("[Worker] Error deleting origin:", error);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

// POST /projects/:id/rotate-key - Rotate API key
app.post("/projects/:id/rotate-key", async (c) => {
  const adminKey = c.req.header("X-Admin-Key");
  if (!validateAdminKey(adminKey ?? null, c.env.ADMIN_API_KEY)) {
    return c.json({ success: false, error: "Invalid admin key" }, 401);
  }

  try {
    const { getPrisma } = await import("./db/index.js");
    const prisma = getPrisma();

    const newApiKey = `pf_${crypto.randomUUID().replace(/-/g, "")}`;

    const project = await prisma.project.update({
      where: { id: c.req.param("id") },
      data: { apiKey: newApiKey },
    });

    return c.json({
      success: true,
      apiKey: project.apiKey,
    });
  } catch (error) {
    console.error("[Worker] Error rotating API key:", error);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

// 404 handler
app.notFound((c) => {
  return c.json({ success: false, error: "Not found" }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error("[Worker] Unhandled error:", err);
  return c.json({ success: false, error: "Internal server error" }, 500);
});

// Export for Cloudflare Workers
export default app;

