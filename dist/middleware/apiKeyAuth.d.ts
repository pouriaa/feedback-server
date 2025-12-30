/**
 * API Key Authentication Middleware
 *
 * Validates incoming requests against project API keys and allowed origins.
 * Attaches the project to the request context for downstream use.
 */
import type { Request, Response, NextFunction } from "express";
import type { Project, AllowedOrigin } from "@prisma/client";
declare global {
    namespace Express {
        interface Request {
            project?: Project & {
                allowedOrigins: AllowedOrigin[];
            };
        }
    }
}
export interface ApiKeyAuthOptions {
    /** Skip origin validation (useful for server-to-server calls) */
    skipOriginValidation?: boolean;
    /** Allow requests without origin header (e.g., non-browser clients) */
    allowMissingOrigin?: boolean;
}
/**
 * Create API key authentication middleware
 *
 * Validates:
 * 1. X-API-Key header is present and valid
 * 2. Origin header matches one of the project's allowed origins
 *
 * On success, attaches `req.project` for use in route handlers.
 */
export declare function createApiKeyAuth(options?: ApiKeyAuthOptions): (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Middleware for project management endpoints (admin-only)
 * Uses a separate admin API key from environment variable
 */
export declare function createAdminAuth(): (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=apiKeyAuth.d.ts.map