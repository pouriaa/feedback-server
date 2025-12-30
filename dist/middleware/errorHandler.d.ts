/**
 * Error handling middleware for the Product Feedback API
 */
import type { Request, Response, NextFunction } from "express";
/**
 * Custom API error class for throwing structured errors
 */
export declare class APIError extends Error {
    statusCode: number;
    details?: unknown | undefined;
    constructor(statusCode: number, message: string, details?: unknown | undefined);
}
/**
 * Creates a 400 Bad Request error
 */
export declare function badRequest(message: string, details?: unknown): APIError;
/**
 * Creates a 401 Unauthorized error
 */
export declare function unauthorized(message?: string): APIError;
/**
 * Creates a 403 Forbidden error
 */
export declare function forbidden(message?: string): APIError;
/**
 * Creates a 404 Not Found error
 */
export declare function notFound(message?: string): APIError;
/**
 * Creates a 429 Too Many Requests error
 */
export declare function tooManyRequests(message?: string): APIError;
/**
 * Creates a 500 Internal Server Error
 */
export declare function internalError(message?: string): APIError;
/**
 * 404 Not Found handler for unmatched routes
 */
export declare function notFoundHandler(_req: Request, res: Response, _next: NextFunction): void;
/**
 * Global error handler middleware
 * Must be registered after all routes
 */
export declare function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void;
/**
 * Async handler wrapper to catch errors in async route handlers
 * Usage: router.post('/path', asyncHandler(async (req, res) => { ... }))
 */
export declare function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=errorHandler.d.ts.map