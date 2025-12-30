/**
 * FeedbackController - Handles HTTP requests for feedback endpoints
 */
import { feedbackService } from "../services/FeedbackService.js";
export class FeedbackController {
    /**
     * POST /feedback - Submit new feedback
     * Requires authenticated project via req.project (set by apiKeyAuth middleware)
     */
    async create(req, res) {
        try {
            const feedbackData = req.body;
            const projectId = req.project?.id;
            if (!projectId) {
                const errorResponse = {
                    success: false,
                    error: "Project context required",
                };
                res.status(401).json(errorResponse);
                return;
            }
            const result = await feedbackService.create(feedbackData, projectId);
            res.status(200).json(result);
        }
        catch (error) {
            console.error("[FeedbackController] Error creating feedback:", error);
            const errorResponse = {
                success: false,
                error: error instanceof Error ? error.message : "Internal server error",
            };
            res.status(500).json(errorResponse);
        }
    }
    /**
     * GET /feedback/:id - Get feedback by ID (optional utility endpoint)
     * Scoped to authenticated project
     */
    async getById(req, res) {
        try {
            const id = req.params.id;
            const projectId = req.project?.id;
            const feedback = await feedbackService.getById(id, projectId);
            if (!feedback) {
                const errorResponse = {
                    success: false,
                    error: "Feedback not found",
                };
                res.status(404).json(errorResponse);
                return;
            }
            res.status(200).json(feedback);
        }
        catch (error) {
            console.error("[FeedbackController] Error getting feedback:", error);
            const errorResponse = {
                success: false,
                error: error instanceof Error ? error.message : "Internal server error",
            };
            res.status(500).json(errorResponse);
        }
    }
}
// Export a singleton instance
export const feedbackController = new FeedbackController();
//# sourceMappingURL=FeedbackController.js.map