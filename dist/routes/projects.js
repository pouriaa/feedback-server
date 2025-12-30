/**
 * Project management routes - Admin only endpoints
 */
import { Router } from "express";
import { projectController } from "../controllers/ProjectController.js";
import { createAdminAuth } from "../middleware/apiKeyAuth.js";
const router = Router();
// All project routes require admin authentication
const adminAuth = createAdminAuth();
router.use(adminAuth);
/**
 * POST /projects
 * Create a new project
 */
router.post("/", (req, res) => projectController.create(req, res));
/**
 * GET /projects
 * List all projects
 */
router.get("/", (req, res) => projectController.list(req, res));
/**
 * GET /projects/:id
 * Get project by ID
 */
router.get("/:id", (req, res) => projectController.getById(req, res));
/**
 * PATCH /projects/:id
 * Update project
 */
router.patch("/:id", (req, res) => projectController.update(req, res));
/**
 * DELETE /projects/:id
 * Delete project
 */
router.delete("/:id", (req, res) => projectController.delete(req, res));
/**
 * POST /projects/:id/origins
 * Add allowed origin to project
 */
router.post("/:id/origins", (req, res) => projectController.addOrigin(req, res));
/**
 * DELETE /projects/:id/origins/:originId
 * Remove allowed origin from project
 */
router.delete("/:id/origins/:originId", (req, res) => projectController.removeOrigin(req, res));
/**
 * POST /projects/:id/rotate-key
 * Rotate project API key
 */
router.post("/:id/rotate-key", (req, res) => projectController.rotateKey(req, res));
export default router;
//# sourceMappingURL=projects.js.map