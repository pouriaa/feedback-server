/**
 * CORS configuration for the Product Feedback API
 */
import cors from "cors";
/**
 * Creates CORS middleware configured for the feedback API
 * Allows cross-origin requests from customer domains
 */
export function createCorsMiddleware() {
    return cors({
        // Allow all origins for now - in production, this should be configurable
        origin: true,
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
        credentials: true,
        maxAge: 86400, // 24 hours
    });
}
//# sourceMappingURL=cors.js.map