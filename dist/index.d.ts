/**
 * Product Feedback Server - Entry Point
 *
 * Express server for handling feedback submissions and DOM snapshot analysis.
 * Uses SQLite via Prisma for persistent storage (local development).
 * For Cloudflare Workers deployment, see worker.ts
 */
import { prisma } from "./db/index.js";
export * from "./types/index.js";
declare const app: import("express-serve-static-core").Express;
export { app, prisma };
//# sourceMappingURL=index.d.ts.map