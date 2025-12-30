/**
 * Rate limiting middleware to prevent abuse
 */
/**
 * Rate limiter for feedback submissions
 * Limits per IP address
 */
export declare const feedbackRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Rate limiter for snapshot submissions
 * More permissive since snapshots are automated
 */
export declare const snapshotRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * General API rate limiter
 */
export declare const generalRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
//# sourceMappingURL=rateLimit.d.ts.map