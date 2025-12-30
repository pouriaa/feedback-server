/**
 * Feedback routes - POST /feedback endpoint
 */
import { Router } from "express";
import { feedbackController } from "../controllers/FeedbackController.js";
import { validateBody } from "../middleware/validation.js";
import { feedbackRateLimiter } from "../middleware/rateLimit.js";
import { createApiKeyAuth } from "../middleware/apiKeyAuth.js";
import { FeedbackDataSchema } from "../types/index.js";
const router = Router();
// API key authentication middleware (allows missing origin for non-browser clients)
const apiKeyAuth = createApiKeyAuth({ allowMissingOrigin: true });
/**
 * POST /feedback
 * Submit new feedback
 * Requires X-API-Key header
 */
router.post("/", apiKeyAuth, feedbackRateLimiter, validateBody(FeedbackDataSchema), (req, res) => feedbackController.create(req, res));
/**
 * GET /feedback/:id
 * Get feedback by ID (utility endpoint)
 * Requires X-API-Key header
 */
router.get("/:id", apiKeyAuth, (req, res) => feedbackController.getById(req, res));
export default router;
//# sourceMappingURL=feedback.js.map