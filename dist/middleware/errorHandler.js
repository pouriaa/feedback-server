/**
 * Error handling middleware for the Product Feedback API
 */
/**
 * Custom API error class for throwing structured errors
 */
export class APIError extends Error {
    statusCode;
    details;
    constructor(statusCode, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.name = "APIError";
        Error.captureStackTrace(this, this.constructor);
    }
}
/**
 * Creates a 400 Bad Request error
 */
export function badRequest(message, details) {
    return new APIError(400, message, details);
}
/**
 * Creates a 401 Unauthorized error
 */
export function unauthorized(message = "Unauthorized") {
    return new APIError(401, message);
}
/**
 * Creates a 403 Forbidden error
 */
export function forbidden(message = "Forbidden") {
    return new APIError(403, message);
}
/**
 * Creates a 404 Not Found error
 */
export function notFound(message = "Not found") {
    return new APIError(404, message);
}
/**
 * Creates a 429 Too Many Requests error
 */
export function tooManyRequests(message = "Too many requests") {
    return new APIError(429, message);
}
/**
 * Creates a 500 Internal Server Error
 */
export function internalError(message = "Internal server error") {
    return new APIError(500, message);
}
/**
 * 404 Not Found handler for unmatched routes
 */
export function notFoundHandler(_req, res, _next) {
    const response = {
        success: false,
        error: "Not found",
    };
    res.status(404).json(response);
}
/**
 * Global error handler middleware
 * Must be registered after all routes
 */
export function errorHandler(err, req, res, _next) {
    // Log error details
    const timestamp = new Date().toISOString();
    const requestInfo = `${req.method} ${req.originalUrl || req.url}`;
    if (err instanceof APIError) {
        // Known API errors - log at appropriate level
        if (err.statusCode >= 500) {
            console.error(`[${timestamp}] ❌ ${requestInfo}: ${err.message}`, err.stack);
        }
        else {
            console.warn(`[${timestamp}] ⚠️  ${requestInfo}: ${err.message}`);
        }
        const response = {
            success: false,
            error: err.message,
        };
        // Only add details if it matches the expected format
        if (Array.isArray(err.details)) {
            response.details = err.details;
        }
        res.status(err.statusCode).json(response);
        return;
    }
    // Unexpected errors - always log full stack
    console.error(`[${timestamp}] ❌ ${requestInfo}: Unhandled error`, err);
    // Don't expose internal error details in production
    const isProduction = process.env.NODE_ENV === "production";
    const response = {
        success: false,
        error: isProduction ? "Internal server error" : err.message,
    };
    res.status(500).json(response);
}
/**
 * Async handler wrapper to catch errors in async route handlers
 * Usage: router.post('/path', asyncHandler(async (req, res) => { ... }))
 */
export function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
//# sourceMappingURL=errorHandler.js.map