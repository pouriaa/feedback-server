/**
 * SnapshotController - Handles HTTP requests for snapshot endpoints
 */
import type { Request, Response } from "express";
export declare class SnapshotController {
    /**
     * POST /snapshots - Submit a snapshot for change detection
     * Requires authenticated project via req.project (set by apiKeyAuth middleware)
     */
    create(req: Request, res: Response): Promise<void>;
    /**
     * GET /snapshots/:id - Get snapshot by ID (optional utility endpoint)
     * Scoped to authenticated project
     */
    getById(req: Request, res: Response): Promise<void>;
}
export declare const snapshotController: SnapshotController;
//# sourceMappingURL=SnapshotController.d.ts.map