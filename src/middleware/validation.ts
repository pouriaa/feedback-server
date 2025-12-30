/**
 * Validation middleware using Zod schemas
 */

import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
import { ZodError } from "zod";
import type { ErrorResponse } from "../types/index.js";

/**
 * Creates a validation middleware for the request body
 */
export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorResponse: ErrorResponse = {
          success: false,
          error: "Validation failed",
          details: error.errors.map((err) => ({
            path: err.path,
            message: err.message,
          })),
        };
        res.status(400).json(errorResponse);
        return;
      }

      const errorResponse: ErrorResponse = {
        success: false,
        error: "Unknown validation error",
      };
      res.status(400).json(errorResponse);
    }
  };
}

