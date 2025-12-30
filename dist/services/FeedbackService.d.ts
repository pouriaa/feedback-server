/**
 * FeedbackService - Business logic for handling feedback submissions
 * Provides in-memory storage with easy interface to swap for database
 */
import type { FeedbackData, StoredFeedback, FeedbackSubmissionResponse } from "../types/index.js";
export declare class FeedbackService {
    /**
     * Store a new feedback submission
     */
    create(data: FeedbackData): Promise<FeedbackSubmissionResponse>;
    /**
     * Get a feedback entry by ID
     */
    getById(id: string): Promise<StoredFeedback | null>;
    /**
     * Get all feedback entries for a session
     */
    getBySessionId(sessionId: string): Promise<StoredFeedback[]>;
    /**
     * Get all feedback entries
     */
    getAll(): Promise<StoredFeedback[]>;
    /**
     * Get the count of feedback entries
     */
    getCount(): Promise<number>;
    /**
     * Clear all feedback (useful for testing)
     */
    clear(): Promise<void>;
}
export declare const feedbackService: FeedbackService;
//# sourceMappingURL=FeedbackService.d.ts.map