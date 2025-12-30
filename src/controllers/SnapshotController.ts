/**
 * SnapshotController - Handles HTTP requests for snapshot endpoints
 */

import type { Request, Response } from "express";
import { snapshotService } from "../services/SnapshotService.js";
import type { ErrorResponse } from "../types/index.js";

export class SnapshotController {
  /**
   * POST /snapshots - Submit a snapshot for change detection
   * Requires authenticated project via req.project (set by apiKeyAuth middleware)
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const snapshotData = req.body;
      const projectId = req.project?.id;

      if (!projectId) {
        const errorResponse: ErrorResponse = {
          success: false,
          error: "Project context required",
        };
        res.status(401).json(errorResponse);
        return;
      }

      const result = await snapshotService.processSnapshot(snapshotData, projectId);
      res.status(200).json(result);
    } catch (error) {
      console.error("[SnapshotController] Error processing snapshot:", error);
      const errorResponse: ErrorResponse = {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      };
      res.status(500).json(errorResponse);
    }
  }

  /**
   * GET /snapshots/:id - Get snapshot by ID (optional utility endpoint)
   * Scoped to authenticated project
   */
  async getById(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const projectId = req.project?.id;
      const snapshot = await snapshotService.getById(id, projectId);

      if (!snapshot) {
        const errorResponse: ErrorResponse = {
          success: false,
          error: "Snapshot not found",
        };
        res.status(404).json(errorResponse);
        return;
      }

      res.status(200).json(snapshot);
    } catch (error) {
      console.error("[SnapshotController] Error getting snapshot:", error);
      const errorResponse: ErrorResponse = {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      };
      res.status(500).json(errorResponse);
    }
  }
}

// Export a singleton instance
export const snapshotController = new SnapshotController();

