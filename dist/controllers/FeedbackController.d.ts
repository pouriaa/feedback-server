/**
 * FeedbackController - Handles HTTP requests for feedback endpoints
 */
import type { Request, Response } from "express";
export declare class FeedbackController {
    /**
     * POST /feedback - Submit new feedback
     * Requires authenticated project via req.project (set by apiKeyAuth middleware)
     */
    create(req: Request, res: Response): Promise<void>;
    /**
     * GET /feedback/:id - Get feedback by ID (optional utility endpoint)
     * Scoped to authenticated project
     */
    getById(req: Request, res: Response): Promise<void>;
}
export declare const feedbackController: FeedbackController;
//# sourceMappingURL=FeedbackController.d.ts.map