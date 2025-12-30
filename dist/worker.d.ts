/**
 * Cloudflare Workers Entry Point for Product Feedback API
 *
 * This file exports a fetch handler compatible with Cloudflare Workers runtime.
 * It wraps the Express app using the hono/node-server adapter for compatibility.
 */
import { Hono } from "hono";
import type { D1Database } from "@cloudflare/workers-types";
interface Env {
    DB: D1Database;
    ADMIN_API_KEY?: string;
    NODE_ENV?: string;
}
declare const app: Hono<{
    Bindings: Env;
}, import("hono/types").BlankSchema, "/">;
export default app;
//# sourceMappingURL=worker.d.ts.map