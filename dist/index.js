/**
 * Product Feedback Server - Entry Point
 *
 * Express server for handling feedback submissions and DOM snapshot analysis.
 */
import express from "express";
import { createCorsMiddleware, generalRateLimiter, requestLogger, errorHandler, notFoundHandler, } from "./middleware/index.js";
import { feedbackRoutes, snapshotRoutes } from "./routes/index.js";
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
// Health check endpoint
app.get("/health", (_req, res) => {
    const response = {
        status: "ok",
        timestamp: new Date().toISOString(),
        version: "0.0.1",
    };
    res.json(response);
});
// API Routes
app.use("/feedback", feedbackRoutes);
app.use("/snapshots", snapshotRoutes);
// 404 handler - must be after all routes
app.use(notFoundHandler);
// Global error handler - must be last
app.use(errorHandler);
// Start server
app.listen(Number(PORT), HOST, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Product Feedback Server                              ║
║                                                           ║
║   Server running at: http://${HOST}:${PORT}                  ║
║                                                           ║
║   Endpoints:                                              ║
║     POST /feedback   - Submit feedback                    ║
║     POST /snapshots  - Submit snapshot for analysis       ║
║     GET  /health     - Health check                       ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});
export default app;
//# sourceMappingURL=index.js.map