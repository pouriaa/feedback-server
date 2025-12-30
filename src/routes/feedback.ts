/**
 * Feedback routes - POST /feedback endpoint
 */

import { Router } from "express";
import { feedbackController } from "../controllers/FeedbackController.js";
import { validateBody } from "../middleware/validation.js";
import { feedbackRateLimiter } from "../middleware/rateLimit.js";
import { FeedbackDataSchema } from "../types/index.js";

const router = Router();

/**
 * POST /feedback
 * Submit new feedback
 */
router.post(
  "/",
  feedbackRateLimiter,
  validateBody(FeedbackDataSchema),
  (req, res) => feedbackController.create(req, res)
);

/**
 * GET /feedback/:id
 * Get feedback by ID (utility endpoint)
 */
router.get("/:id", (req, res) => feedbackController.getById(req, res));

export default router;

