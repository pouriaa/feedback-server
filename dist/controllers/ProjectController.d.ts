/**
 * ProjectController - Handles HTTP requests for project management endpoints
 */
import type { Request, Response } from "express";
export declare class ProjectController {
    /**
     * POST /projects - Create new project
     */
    create(req: Request, res: Response): Promise<void>;
    /**
     * GET /projects - List all projects
     */
    list(_req: Request, res: Response): Promise<void>;
    /**
     * GET /projects/:id - Get project by ID
     */
    getById(req: Request<{
        id: string;
    }>, res: Response): Promise<void>;
    /**
     * PATCH /projects/:id - Update project
     */
    update(req: Request<{
        id: string;
    }>, res: Response): Promise<void>;
    /**
     * DELETE /projects/:id - Delete project
     */
    delete(req: Request<{
        id: string;
    }>, res: Response): Promise<void>;
    /**
     * POST /projects/:id/origins - Add allowed origin
     */
    addOrigin(req: Request<{
        id: string;
    }>, res: Response): Promise<void>;
    /**
     * DELETE /projects/:id/origins/:originId - Remove allowed origin
     */
    removeOrigin(req: Request<{
        id: string;
        originId: string;
    }>, res: Response): Promise<void>;
    /**
     * POST /projects/:id/rotate-key - Rotate API key
     */
    rotateKey(req: Request<{
        id: string;
    }>, res: Response): Promise<void>;
}
export declare const projectController: ProjectController;
//# sourceMappingURL=ProjectController.d.ts.map