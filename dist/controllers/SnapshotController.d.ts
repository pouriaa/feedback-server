/**
 * SnapshotController - Handles HTTP requests for snapshot endpoints
 */
import type { Request, Response } from "express";
export declare class SnapshotController {
    /**
     * POST /snapshots - Submit a snapshot for change detection
     */
    create(req: Request, res: Response): Promise<void>;
    /**
     * GET /snapshots/:id - Get snapshot by ID (optional utility endpoint)
     */
    getById(req: Request<{
        id: string;
    }>, res: Response): Promise<void>;
}
export declare const snapshotController: SnapshotController;
//# sourceMappingURL=SnapshotController.d.ts.map