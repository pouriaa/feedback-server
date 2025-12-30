/**
 * CORS configuration for the Product Feedback API
 */
import cors from "cors";
/**
 * Creates CORS middleware configured for the feedback API
 * Allows cross-origin requests from customer domains
 */
export declare function createCorsMiddleware(): (req: cors.CorsRequest, res: {
    statusCode?: number | undefined;
    setHeader(key: string, value: string): any;
    end(): any;
}, next: (err?: any) => any) => void;
//# sourceMappingURL=cors.d.ts.map