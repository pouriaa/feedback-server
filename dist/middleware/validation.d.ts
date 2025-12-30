/**
 * Validation middleware using Zod schemas
 */
import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
/**
 * Creates a validation middleware for the request body
 */
export declare function validateBody<T>(schema: ZodSchema<T>): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=validation.d.ts.map