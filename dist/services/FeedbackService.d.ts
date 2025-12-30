/**
 * FeedbackService - Business logic for handling feedback submissions
 * Uses Prisma with SQLite/D1 for persistent storage
 */
import type { FeedbackData, StoredFeedback, FeedbackSubmissionResponse } from "../types/index.js";
export declare class FeedbackService {
    /**
     * Store a new feedback submission
     * @param data - Feedback data from the client
     * @param projectId - Project ID for multi-tenancy
     */
    create(data: FeedbackData, projectId: string): Promise<FeedbackSubmissionResponse>;
    /**
     * Get a feedback entry by ID (optionally scoped to project)
     */
    getById(id: string, projectId?: string): Promise<StoredFeedback | null>;
    /**
     * Get all feedback entries for a session (scoped to project)
     */
    getBySessionId(sessionId: string, projectId: string): Promise<StoredFeedback[]>;
    /**
     * Get all feedback entries for a project
     */
    getAll(projectId: string): Promise<StoredFeedback[]>;
    /**
     * Get the count of feedback entries for a project
     */
    getCount(projectId: string): Promise<number>;
    /**
     * Clear all feedback for a project (useful for testing)
     */
    clear(projectId: string): Promise<void>;
    /**
     * Convert Prisma model to StoredFeedback type
     */
    private toStoredFeedback;
}
export declare const feedbackService: FeedbackService;
//# sourceMappingURL=FeedbackService.d.ts.map