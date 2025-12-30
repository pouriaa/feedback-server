/**
 * FeedbackService - Business logic for handling feedback submissions
 * Provides in-memory storage with easy interface to swap for database
 */
import { v4 as uuidv4 } from "uuid";
/**
 * In-memory storage for feedback (can be swapped for database)
 */
const feedbackStore = new Map();
export class FeedbackService {
    /**
     * Store a new feedback submission
     */
    async create(data) {
        const id = uuidv4();
        const receivedAt = new Date().toISOString();
        const storedFeedback = {
            ...data,
            id,
            receivedAt,
        };
        feedbackStore.set(id, storedFeedback);
        console.log(`[FeedbackService] Stored feedback ${id}`, {
            sessionId: data.context.sessionId,
            trigger: data.context.trigger.type,
            responseType: data.response.type,
        });
        return {
            success: true,
            id,
        };
    }
    /**
     * Get a feedback entry by ID
     */
    async getById(id) {
        return feedbackStore.get(id) ?? null;
    }
    /**
     * Get all feedback entries for a session
     */
    async getBySessionId(sessionId) {
        const results = [];
        for (const feedback of feedbackStore.values()) {
            if (feedback.context.sessionId === sessionId) {
                results.push(feedback);
            }
        }
        return results;
    }
    /**
     * Get all feedback entries
     */
    async getAll() {
        return Array.from(feedbackStore.values());
    }
    /**
     * Get the count of feedback entries
     */
    async getCount() {
        return feedbackStore.size;
    }
    /**
     * Clear all feedback (useful for testing)
     */
    async clear() {
        feedbackStore.clear();
    }
}
// Export a singleton instance
export const feedbackService = new FeedbackService();
//# sourceMappingURL=FeedbackService.js.map