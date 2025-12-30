/**
 * API Key Authentication Middleware
 *
 * Validates incoming requests against project API keys and allowed origins.
 * Attaches the project to the request context for downstream use.
 */
import { getPrisma } from "../db/client.js";
/**
 * Create API key authentication middleware
 *
 * Validates:
 * 1. X-API-Key header is present and valid
 * 2. Origin header matches one of the project's allowed origins
 *
 * On success, attaches `req.project` for use in route handlers.
 */
export function createApiKeyAuth(options = {}) {
    const { skipOriginValidation = false, allowMissingOrigin = false } = options;
    return async (req, res, next) => {
        const apiKey = req.headers["x-api-key"];
        const origin = req.headers["origin"];
        // Check for API key
        if (!apiKey || typeof apiKey !== "string") {
            res.status(401).json({
                success: false,
                error: "API key required",
                details: "Include X-API-Key header with your project's API key",
            });
            return;
        }
        try {
            const prisma = getPrisma();
            // Look up project by API key
            const project = await prisma.project.findUnique({
                where: { apiKey },
                include: { allowedOrigins: true },
            });
            if (!project) {
                res.status(401).json({
                    success: false,
                    error: "Invalid API key",
                    details: "The provided API key does not match any project",
                });
                return;
            }
            // Origin validation (if not skipped)
            if (!skipOriginValidation) {
                // Check if origin is required but missing
                if (!origin && !allowMissingOrigin) {
                    res.status(403).json({
                        success: false,
                        error: "Origin header required",
                        details: "Browser requests must include an Origin header",
                    });
                    return;
                }
                // If origin is present, validate against allowed origins
                if (origin) {
                    const isOriginAllowed = project.allowedOrigins.some((o) => o.origin === origin || o.origin === "*");
                    if (!isOriginAllowed) {
                        res.status(403).json({
                            success: false,
                            error: "Origin not allowed",
                            details: `The origin '${origin}' is not in the allowed origins list for this project`,
                        });
                        return;
                    }
                }
            }
            // Attach project to request for downstream use
            req.project = project;
            next();
        }
        catch (error) {
            console.error("[ApiKeyAuth] Error validating API key:", error);
            res.status(500).json({
                success: false,
                error: "Internal server error",
                details: "Failed to validate API key",
            });
        }
    };
}
/**
 * Middleware for project management endpoints (admin-only)
 * Uses a separate admin API key from environment variable
 */
export function createAdminAuth() {
    return async (req, res, next) => {
        const adminKey = req.headers["x-admin-key"];
        const expectedKey = process.env.ADMIN_API_KEY;
        // Check if admin key is configured
        if (!expectedKey) {
            console.error("[AdminAuth] ADMIN_API_KEY not configured");
            res.status(500).json({
                success: false,
                error: "Admin authentication not configured",
            });
            return;
        }
        // Validate admin key
        if (!adminKey || adminKey !== expectedKey) {
            res.status(401).json({
                success: false,
                error: "Invalid admin key",
                details: "Include X-Admin-Key header with valid admin API key",
            });
            return;
        }
        next();
    };
}
//# sourceMappingURL=apiKeyAuth.js.map