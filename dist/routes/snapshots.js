/**
 * Snapshot routes - POST /snapshots endpoint
 */
import { Router } from "express";
import { snapshotController } from "../controllers/SnapshotController.js";
import { validateBody } from "../middleware/validation.js";
import { snapshotRateLimiter } from "../middleware/rateLimit.js";
import { createApiKeyAuth } from "../middleware/apiKeyAuth.js";
import { SnapshotDataSchema } from "../types/index.js";
const router = Router();
// API key authentication middleware (allows missing origin for non-browser clients)
const apiKeyAuth = createApiKeyAuth({ allowMissingOrigin: true });
/**
 * POST /snapshots
 * Submit a snapshot for change detection
 * Requires X-API-Key header
 */
router.post("/", apiKeyAuth, snapshotRateLimiter, validateBody(SnapshotDataSchema), (req, res) => snapshotController.create(req, res));
/**
 * GET /snapshots/:id
 * Get snapshot by ID (utility endpoint)
 * Requires X-API-Key header
 */
router.get("/:id", apiKeyAuth, (req, res) => snapshotController.getById(req, res));
export default router;
//# sourceMappingURL=snapshots.js.map