/**
 * Request logging middleware for the Product Feedback API
 * Logs incoming requests with timing information
 */
import type { Request, Response, NextFunction } from "express";
export interface LogEntry {
    method: string;
    url: string;
    status: number;
    duration: number;
    timestamp: string;
    ip: string;
    userAgent: string;
}
/**
 * Request logging middleware
 * Logs method, URL, status code, and response time
 */
export declare function requestLogger(): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Simple request logger that only logs to console without colors
 * Useful for production environments where logs are processed
 */
export declare function simpleRequestLogger(): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=requestLogger.d.ts.map