/**
 * FeedbackService - Business logic for handling feedback submissions
 * Uses Prisma with SQLite/D1 for persistent storage
 */
import { getPrisma } from "../db/index.js";
export class FeedbackService {
    /**
     * Store a new feedback submission
     * @param data - Feedback data from the client
     * @param projectId - Project ID for multi-tenancy
     */
    async create(data, projectId) {
        const prisma = getPrisma();
        const feedback = await prisma.feedback.create({
            data: {
                // Project relation
                projectId,
                // Context fields
                timestamp: data.context.timestamp,
                url: data.context.url,
                referrer: data.context.referrer,
                userAgent: data.context.userAgent,
                sessionId: data.context.sessionId,
                domPath: data.context.domPath,
                // Viewport
                viewportWidth: data.context.viewport.width,
                viewportHeight: data.context.viewport.height,
                // Trigger info
                triggerType: data.context.trigger.type,
                triggerElement: data.context.trigger.element,
                triggerCoordX: data.context.trigger.coordinates?.x,
                triggerCoordY: data.context.trigger.coordinates?.y,
                // Response (value stored as JSON string)
                responseType: data.response.type,
                responseValue: JSON.stringify(data.response.value),
            },
        });
        console.log(`[FeedbackService] Stored feedback ${feedback.id}`, {
            projectId,
            sessionId: data.context.sessionId,
            trigger: data.context.trigger.type,
            responseType: data.response.type,
        });
        return {
            success: true,
            id: feedback.id,
        };
    }
    /**
     * Get a feedback entry by ID (optionally scoped to project)
     */
    async getById(id, projectId) {
        const prisma = getPrisma();
        const feedback = await prisma.feedback.findUnique({
            where: { id },
        });
        if (!feedback)
            return null;
        // If projectId provided, verify ownership
        if (projectId && feedback.projectId !== projectId) {
            return null;
        }
        return this.toStoredFeedback(feedback);
    }
    /**
     * Get all feedback entries for a session (scoped to project)
     */
    async getBySessionId(sessionId, projectId) {
        const prisma = getPrisma();
        const feedbacks = await prisma.feedback.findMany({
            where: { sessionId, projectId },
            orderBy: { receivedAt: "desc" },
        });
        return feedbacks.map((f) => this.toStoredFeedback(f));
    }
    /**
     * Get all feedback entries for a project
     */
    async getAll(projectId) {
        const prisma = getPrisma();
        const feedbacks = await prisma.feedback.findMany({
            where: { projectId },
            orderBy: { receivedAt: "desc" },
        });
        return feedbacks.map((f) => this.toStoredFeedback(f));
    }
    /**
     * Get the count of feedback entries for a project
     */
    async getCount(projectId) {
        const prisma = getPrisma();
        return prisma.feedback.count({ where: { projectId } });
    }
    /**
     * Clear all feedback for a project (useful for testing)
     */
    async clear(projectId) {
        const prisma = getPrisma();
        await prisma.feedback.deleteMany({ where: { projectId } });
    }
    /**
     * Convert Prisma model to StoredFeedback type
     */
    toStoredFeedback(feedback) {
        return {
            id: feedback.id,
            receivedAt: feedback.receivedAt.toISOString(),
            context: {
                timestamp: feedback.timestamp,
                url: feedback.url,
                referrer: feedback.referrer,
                userAgent: feedback.userAgent,
                sessionId: feedback.sessionId,
                domPath: feedback.domPath,
                viewport: {
                    width: feedback.viewportWidth,
                    height: feedback.viewportHeight,
                },
                trigger: {
                    type: feedback.triggerType,
                    element: feedback.triggerElement ?? undefined,
                    coordinates: feedback.triggerCoordX !== null && feedback.triggerCoordY !== null
                        ? { x: feedback.triggerCoordX, y: feedback.triggerCoordY }
                        : undefined,
                },
            },
            response: {
                type: feedback.responseType,
                value: JSON.parse(feedback.responseValue),
            },
        };
    }
}
// Export a singleton instance
export const feedbackService = new FeedbackService();
//# sourceMappingURL=FeedbackService.js.map