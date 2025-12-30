/**
 * FeedbackService - Business logic for handling feedback submissions
 * Uses Prisma with SQLite for persistent storage
 */

import { prisma } from "../db/index.js";
import type { FeedbackData, StoredFeedback, FeedbackSubmissionResponse } from "../types/index.js";

export class FeedbackService {
  /**
   * Store a new feedback submission
   */
  async create(data: FeedbackData): Promise<FeedbackSubmissionResponse> {
    const feedback = await prisma.feedback.create({
      data: {
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
   * Get a feedback entry by ID
   */
  async getById(id: string): Promise<StoredFeedback | null> {
    const feedback = await prisma.feedback.findUnique({
      where: { id },
    });

    if (!feedback) return null;

    return this.toStoredFeedback(feedback);
  }

  /**
   * Get all feedback entries for a session
   */
  async getBySessionId(sessionId: string): Promise<StoredFeedback[]> {
    const feedbacks = await prisma.feedback.findMany({
      where: { sessionId },
      orderBy: { receivedAt: "desc" },
    });

    return feedbacks.map((f) => this.toStoredFeedback(f));
  }

  /**
   * Get all feedback entries
   */
  async getAll(): Promise<StoredFeedback[]> {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: { receivedAt: "desc" },
    });

    return feedbacks.map((f) => this.toStoredFeedback(f));
  }

  /**
   * Get the count of feedback entries
   */
  async getCount(): Promise<number> {
    return prisma.feedback.count();
  }

  /**
   * Clear all feedback (useful for testing)
   */
  async clear(): Promise<void> {
    await prisma.feedback.deleteMany();
  }

  /**
   * Convert Prisma model to StoredFeedback type
   */
  private toStoredFeedback(feedback: {
    id: string;
    receivedAt: Date;
    timestamp: string;
    url: string;
    referrer: string;
    userAgent: string;
    sessionId: string;
    domPath: string;
    viewportWidth: number;
    viewportHeight: number;
    triggerType: string;
    triggerElement: string | null;
    triggerCoordX: number | null;
    triggerCoordY: number | null;
    responseType: string;
    responseValue: string;
  }): StoredFeedback {
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
          type: feedback.triggerType as "rageClick" | "custom" | "snapshot",
          element: feedback.triggerElement ?? undefined,
          coordinates:
            feedback.triggerCoordX !== null && feedback.triggerCoordY !== null
              ? { x: feedback.triggerCoordX, y: feedback.triggerCoordY }
              : undefined,
        },
      },
      response: {
        type: feedback.responseType as "rating" | "choice" | "text",
        value: JSON.parse(feedback.responseValue),
      },
    };
  }
}

// Export a singleton instance
export const feedbackService = new FeedbackService();
