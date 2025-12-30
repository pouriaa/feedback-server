/**
 * Validation middleware using Zod schemas
 */
import { ZodError } from "zod";
/**
 * Creates a validation middleware for the request body
 */
export function validateBody(schema) {
    return (req, res, next) => {
        try {
            const parsed = schema.parse(req.body);
            req.body = parsed;
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                const errorResponse = {
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
            const errorResponse = {
                success: false,
                error: "Unknown validation error",
            };
            res.status(400).json(errorResponse);
        }
    };
}
//# sourceMappingURL=validation.js.map