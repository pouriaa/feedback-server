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

type LogLevel = "info" | "warn" | "error";

function getLogLevel(status: number): LogLevel {
  if (status >= 500) return "error";
  if (status >= 400) return "warn";
  return "info";
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function getStatusColor(status: number): string {
  if (status >= 500) return "\x1b[31m"; // Red
  if (status >= 400) return "\x1b[33m"; // Yellow
  if (status >= 300) return "\x1b[36m"; // Cyan
  if (status >= 200) return "\x1b[32m"; // Green
  return "\x1b[0m"; // Reset
}

const RESET = "\x1b[0m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";

/**
 * Request logging middleware
 * Logs method, URL, status code, and response time
 */
export function requestLogger() {
  return (req: Request, res: Response, next: NextFunction): void => {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    // Log when response finishes
    res.on("finish", () => {
      const duration = Date.now() - startTime;
      const status = res.statusCode;
      const statusColor = getStatusColor(status);
      const level = getLogLevel(status);

      const logEntry: LogEntry = {
        method: req.method,
        url: req.originalUrl || req.url,
        status,
        duration,
        timestamp,
        ip: req.ip || req.socket.remoteAddress || "unknown",
        userAgent: req.get("user-agent") || "unknown",
      };

      // Format log message
      const methodPad = req.method.padEnd(6);
      const statusStr = `${statusColor}${status}${RESET}`;
      const durationStr = `${DIM}${formatDuration(duration)}${RESET}`;
      const urlStr = `${BOLD}${logEntry.url}${RESET}`;

      const prefix = level === "error" ? "❌" : level === "warn" ? "⚠️ " : "→";
      
      console.log(
        `${DIM}[${timestamp}]${RESET} ${prefix} ${methodPad} ${statusStr} ${urlStr} ${durationStr}`
      );

      // Log additional details for errors
      if (level === "error") {
        console.log(`  ${DIM}IP: ${logEntry.ip}, UA: ${logEntry.userAgent}${RESET}`);
      }
    });

    next();
  };
}

/**
 * Simple request logger that only logs to console without colors
 * Useful for production environments where logs are processed
 */
export function simpleRequestLogger() {
  return (req: Request, res: Response, next: NextFunction): void => {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    res.on("finish", () => {
      const duration = Date.now() - startTime;
      const logData = {
        timestamp,
        method: req.method,
        url: req.originalUrl || req.url,
        status: res.statusCode,
        duration,
        ip: req.ip || req.socket.remoteAddress,
      };
      console.log(JSON.stringify(logData));
    });

    next();
  };
}

