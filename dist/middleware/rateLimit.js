/**
 * Rate limiting middleware to prevent abuse
 */
import rateLimit from "express-rate-limit";
/**
 * Rate limiter for feedback submissions
 * Limits per IP address
 */
export const feedbackRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute window
    max: 30, // 30 requests per minute per IP
    message: {
        success: false,
        error: "Too many feedback submissions, please try again later",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
/**
 * Rate limiter for snapshot submissions
 * More permissive since snapshots are automated
 */
export const snapshotRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute window
    max: 60, // 60 requests per minute per IP
    message: {
        success: false,
        error: "Too many snapshot submissions, please try again later",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
/**
 * General API rate limiter
 */
export const generalRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute window
    max: 100, // 100 requests per minute per IP
    message: {
        success: false,
        error: "Too many requests, please try again later",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
//# sourceMappingURL=rateLimit.js.map