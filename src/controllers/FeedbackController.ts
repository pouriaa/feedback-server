/**
 * FeedbackController - Handles HTTP requests for feedback endpoints
 */

import type { Request, Response } from "express";
import { feedbackService } from "../services/FeedbackService.js";
import type { ErrorResponse } from "../types/index.js";

export class FeedbackController {
  /**
   * POST /feedback - Submit new feedback
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const feedbackData = req.body;
      const result = await feedbackService.create(feedbackData);
      res.status(200).json(result);
    } catch (error) {
      console.error("[FeedbackController] Error creating feedback:", error);
      const errorResponse: ErrorResponse = {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      };
      res.status(500).json(errorResponse);
    }
  }

  /**
   * GET /feedback/:id - Get feedback by ID (optional utility endpoint)
   */
  async getById(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const feedback = await feedbackService.getById(id);

      if (!feedback) {
        const errorResponse: ErrorResponse = {
          success: false,
          error: "Feedback not found",
        };
        res.status(404).json(errorResponse);
        return;
      }

      res.status(200).json(feedback);
    } catch (error) {
      console.error("[FeedbackController] Error getting feedback:", error);
      const errorResponse: ErrorResponse = {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      };
      res.status(500).json(errorResponse);
    }
  }
}

// Export a singleton instance
export const feedbackController = new FeedbackController();

