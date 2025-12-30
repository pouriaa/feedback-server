/**
 * ProjectService - Business logic for managing projects
 * Uses Prisma with SQLite/D1 for persistent storage
 */
import { getPrisma } from "../db/index.js";
import { v4 as uuidv4 } from "uuid";
export class ProjectService {
    /**
     * Generate a unique API key for a project
     */
    generateApiKey() {
        return `pf_${uuidv4().replace(/-/g, "")}`;
    }
    /**
     * Create a new project
     */
    async create(input) {
        const prisma = getPrisma();
        const apiKey = this.generateApiKey();
        const project = await prisma.project.create({
            data: {
                name: input.name,
                apiKey,
                allowedOrigins: {
                    create: (input.allowedOrigins ?? []).map((origin) => ({ origin })),
                },
            },
            include: { allowedOrigins: true },
        });
        console.log(`[ProjectService] Created project ${project.id}: ${project.name}`);
        return {
            id: project.id,
            name: project.name,
            apiKey: project.apiKey,
            allowedOrigins: project.allowedOrigins.map((o) => o.origin),
            createdAt: project.createdAt.toISOString(),
            updatedAt: project.updatedAt.toISOString(),
        };
    }
    /**
     * Get a project by ID
     */
    async getById(id) {
        const prisma = getPrisma();
        const project = await prisma.project.findUnique({
            where: { id },
            include: { allowedOrigins: true },
        });
        if (!project)
            return null;
        return {
            id: project.id,
            name: project.name,
            apiKey: project.apiKey,
            allowedOrigins: project.allowedOrigins.map((o) => o.origin),
            createdAt: project.createdAt.toISOString(),
            updatedAt: project.updatedAt.toISOString(),
        };
    }
    /**
     * Get all projects
     */
    async getAll() {
        const prisma = getPrisma();
        const projects = await prisma.project.findMany({
            include: { allowedOrigins: true },
            orderBy: { createdAt: "desc" },
        });
        return projects.map((project) => ({
            id: project.id,
            name: project.name,
            apiKey: project.apiKey,
            allowedOrigins: project.allowedOrigins.map((o) => o.origin),
            createdAt: project.createdAt.toISOString(),
            updatedAt: project.updatedAt.toISOString(),
        }));
    }
    /**
     * Update a project
     */
    async update(id, input) {
        const prisma = getPrisma();
        try {
            const project = await prisma.project.update({
                where: { id },
                data: { name: input.name },
                include: { allowedOrigins: true },
            });
            console.log(`[ProjectService] Updated project ${project.id}`);
            return {
                id: project.id,
                name: project.name,
                apiKey: project.apiKey,
                allowedOrigins: project.allowedOrigins.map((o) => o.origin),
                createdAt: project.createdAt.toISOString(),
                updatedAt: project.updatedAt.toISOString(),
            };
        }
        catch (error) {
            // Project not found
            return null;
        }
    }
    /**
     * Delete a project
     */
    async delete(id) {
        const prisma = getPrisma();
        try {
            await prisma.project.delete({ where: { id } });
            console.log(`[ProjectService] Deleted project ${id}`);
            return true;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Add an allowed origin to a project
     */
    async addOrigin(projectId, origin) {
        const prisma = getPrisma();
        try {
            const allowedOrigin = await prisma.allowedOrigin.create({
                data: { projectId, origin },
            });
            console.log(`[ProjectService] Added origin ${origin} to project ${projectId}`);
            return {
                id: allowedOrigin.id,
                origin: allowedOrigin.origin,
                createdAt: allowedOrigin.createdAt.toISOString(),
            };
        }
        catch (error) {
            // Project not found or duplicate origin
            return null;
        }
    }
    /**
     * Remove an allowed origin from a project
     */
    async removeOrigin(originId) {
        const prisma = getPrisma();
        try {
            await prisma.allowedOrigin.delete({ where: { id: originId } });
            console.log(`[ProjectService] Removed origin ${originId}`);
            return true;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Rotate a project's API key
     */
    async rotateApiKey(projectId) {
        const prisma = getPrisma();
        const newApiKey = this.generateApiKey();
        try {
            const project = await prisma.project.update({
                where: { id: projectId },
                data: { apiKey: newApiKey },
            });
            console.log(`[ProjectService] Rotated API key for project ${projectId}`);
            return project.apiKey;
        }
        catch (error) {
            return null;
        }
    }
}
// Export a singleton instance
export const projectService = new ProjectService();
//# sourceMappingURL=ProjectService.js.map