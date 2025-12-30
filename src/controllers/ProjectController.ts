/**
 * ProjectController - Handles HTTP requests for project management endpoints
 */

import type { Request, Response } from "express";
import { projectService } from "../services/ProjectService.js";
import type { ErrorResponse } from "../types/index.js";

export class ProjectController {
  /**
   * POST /projects - Create new project
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, allowedOrigins } = req.body;

      if (!name || typeof name !== "string") {
        const errorResponse: ErrorResponse = {
          success: false,
          error: "Project name is required",
        };
        res.status(400).json(errorResponse);
        return;
      }

      const project = await projectService.create({
        name,
        allowedOrigins: Array.isArray(allowedOrigins) ? allowedOrigins : undefined,
      });

      res.status(201).json({ success: true, project });
    } catch (error) {
      console.error("[ProjectController] Error creating project:", error);
      const errorResponse: ErrorResponse = {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      };
      res.status(500).json(errorResponse);
    }
  }

  /**
   * GET /projects - List all projects
   */
  async list(_req: Request, res: Response): Promise<void> {
    try {
      const projects = await projectService.getAll();
      res.status(200).json({ success: true, projects });
    } catch (error) {
      console.error("[ProjectController] Error listing projects:", error);
      const errorResponse: ErrorResponse = {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      };
      res.status(500).json(errorResponse);
    }
  }

  /**
   * GET /projects/:id - Get project by ID
   */
  async getById(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const project = await projectService.getById(id);

      if (!project) {
        const errorResponse: ErrorResponse = {
          success: false,
          error: "Project not found",
        };
        res.status(404).json(errorResponse);
        return;
      }

      res.status(200).json({ success: true, project });
    } catch (error) {
      console.error("[ProjectController] Error getting project:", error);
      const errorResponse: ErrorResponse = {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      };
      res.status(500).json(errorResponse);
    }
  }

  /**
   * PATCH /projects/:id - Update project
   */
  async update(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const project = await projectService.update(id, { name });

      if (!project) {
        const errorResponse: ErrorResponse = {
          success: false,
          error: "Project not found",
        };
        res.status(404).json(errorResponse);
        return;
      }

      res.status(200).json({ success: true, project });
    } catch (error) {
      console.error("[ProjectController] Error updating project:", error);
      const errorResponse: ErrorResponse = {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      };
      res.status(500).json(errorResponse);
    }
  }

  /**
   * DELETE /projects/:id - Delete project
   */
  async delete(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await projectService.delete(id);

      if (!deleted) {
        const errorResponse: ErrorResponse = {
          success: false,
          error: "Project not found",
        };
        res.status(404).json(errorResponse);
        return;
      }

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("[ProjectController] Error deleting project:", error);
      const errorResponse: ErrorResponse = {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      };
      res.status(500).json(errorResponse);
    }
  }

  /**
   * POST /projects/:id/origins - Add allowed origin
   */
  async addOrigin(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { origin } = req.body;

      if (!origin || typeof origin !== "string") {
        const errorResponse: ErrorResponse = {
          success: false,
          error: "Origin is required",
        };
        res.status(400).json(errorResponse);
        return;
      }

      const allowedOrigin = await projectService.addOrigin(id, origin);

      if (!allowedOrigin) {
        const errorResponse: ErrorResponse = {
          success: false,
          error: "Failed to add origin (project not found or origin already exists)",
        };
        res.status(400).json(errorResponse);
        return;
      }

      res.status(201).json({ success: true, origin: allowedOrigin });
    } catch (error) {
      console.error("[ProjectController] Error adding origin:", error);
      const errorResponse: ErrorResponse = {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      };
      res.status(500).json(errorResponse);
    }
  }

  /**
   * DELETE /projects/:id/origins/:originId - Remove allowed origin
   */
  async removeOrigin(
    req: Request<{ id: string; originId: string }>,
    res: Response
  ): Promise<void> {
    try {
      const { originId } = req.params;
      const deleted = await projectService.removeOrigin(originId);

      if (!deleted) {
        const errorResponse: ErrorResponse = {
          success: false,
          error: "Origin not found",
        };
        res.status(404).json(errorResponse);
        return;
      }

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("[ProjectController] Error removing origin:", error);
      const errorResponse: ErrorResponse = {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      };
      res.status(500).json(errorResponse);
    }
  }

  /**
   * POST /projects/:id/rotate-key - Rotate API key
   */
  async rotateKey(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const newApiKey = await projectService.rotateApiKey(id);

      if (!newApiKey) {
        const errorResponse: ErrorResponse = {
          success: false,
          error: "Project not found",
        };
        res.status(404).json(errorResponse);
        return;
      }

      res.status(200).json({ success: true, apiKey: newApiKey });
    } catch (error) {
      console.error("[ProjectController] Error rotating API key:", error);
      const errorResponse: ErrorResponse = {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      };
      res.status(500).json(errorResponse);
    }
  }
}

// Export a singleton instance
export const projectController = new ProjectController();

