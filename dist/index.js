/**
 * Product Feedback Server - Entry Point
 *
 * Express server for handling feedback submissions and DOM snapshot analysis.
 * Uses SQLite via Prisma for persistent storage (local development).
 * For Cloudflare Workers deployment, see worker.ts
 */
import express from "express";
import { createCorsMiddleware, generalRateLimiter, requestLogger, errorHandler, notFoundHandler, } from "./middleware/index.js";
import { feedbackRoutes, snapshotRoutes, projectRoutes } from "./routes/index.js";
import { prisma, initializePrisma, disconnectDb, testConnection } from "./db/index.js";
// Re-export types for external use
export * from "./types/index.js";
// Configuration
const PORT = process.env.PORT ?? 3001;
const HOST = process.env.HOST ?? "0.0.0.0";
// Create Express app
const app = express();
// Global middleware
app.use(express.json({ limit: "5mb" })); // Support large HTML snapshots
app.use(createCorsMiddleware());
app.use(requestLogger());
app.use(generalRateLimiter);
// Health check endpoint (includes DB status)
app.get("/health", async (_req, res) => {
    const dbConnected = await testConnection();
    const response = {
        status: "ok",
        timestamp: new Date().toISOString(),
        version: "0.0.1",
    };
    if (!dbConnected) {
        res.status(503).json({
            ...response,
            status: "degraded",
            error: "Database connection failed",
        });
        return;
    }
    res.json(response);
});
// API Routes
app.use("/feedback", feedbackRoutes);
app.use("/snapshots", snapshotRoutes);
app.use("/projects", projectRoutes);
// 404 handler - must be after all routes
app.use(notFoundHandler);
// Global error handler - must be last
app.use(errorHandler);
// Graceful shutdown
async function shutdown(signal) {
    console.log(`\n[Server] Received ${signal}, shutting down gracefully...`);
    await disconnectDb();
    process.exit(0);
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
// Start server
async function start() {
    // Initialize Prisma client
    await initializePrisma();
    // Test database connection on startup
    const dbOk = await testConnection();
    if (!dbOk) {
        console.error(`
╔═══════════════════════════════════════════════════════════╗
║   ⚠️  DATABASE CONNECTION FAILED                          ║
║                                                           ║
║   Make sure to run migrations first:                      ║
║     cd server && npm run db:push                          ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `);
    }
    app.listen(Number(PORT), HOST, () => {
        console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Product Feedback Server                              ║
║                                                           ║
║   Server running at: http://${HOST}:${PORT}                  ║
║   Database: SQLite (prisma/dev.db)                        ║
║                                                           ║
║   Endpoints:                                              ║
║     POST /feedback    - Submit feedback (requires API key)║
║     POST /snapshots   - Submit snapshot (requires API key)║
║     GET  /health      - Health check                      ║
║     POST /projects    - Create project (admin only)       ║
║                                                           ║
║   Authentication:                                         ║
║     X-API-Key: Project API key for SDK endpoints          ║
║     X-Admin-Key: Admin key for project management         ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `);
    });
}
// Only start server when this file is run directly, not when imported
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
    start().catch((err) => {
        console.error("Failed to start server:", err);
        process.exit(1);
    });
}
export { app, prisma };
//# sourceMappingURL=index.js.map