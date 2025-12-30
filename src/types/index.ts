/**
 * Server-side type definitions and Zod schemas for Product Feedback API
 * These schemas match the frontend contracts defined in @product-feedback/core
 */

import { z } from "zod";

// ========================================
// Enums and Literals
// ========================================

export const TriggerTypeSchema = z.enum(["rageClick", "custom", "snapshot"]);
export type TriggerType = z.infer<typeof TriggerTypeSchema>;

export const PromptTypeSchema = z.enum(["rating", "choice", "text"]);
export type PromptType = z.infer<typeof PromptTypeSchema>;

export const ChangeTypeSchema = z.enum(["added", "modified", "removed"]);
export type ChangeType = z.infer<typeof ChangeTypeSchema>;

// ========================================
// Shared Schemas
// ========================================

export const ViewportSchema = z.object({
  width: z.number().int().nonnegative(),
  height: z.number().int().nonnegative(),
});
export type Viewport = z.infer<typeof ViewportSchema>;

export const CoordinatesSchema = z.object({
  x: z.number(),
  y: z.number(),
});
export type Coordinates = z.infer<typeof CoordinatesSchema>;

// ========================================
// Trigger Info
// ========================================

export const TriggerInfoSchema = z.object({
  type: TriggerTypeSchema,
  element: z.string().optional(),
  coordinates: CoordinatesSchema.optional(),
});
export type TriggerInfo = z.infer<typeof TriggerInfoSchema>;

// ========================================
// Context Data
// ========================================

export const ContextDataSchema = z.object({
  timestamp: z.string().datetime({ message: "Must be a valid ISO 8601 timestamp" }),
  url: z.string().url({ message: "Must be a valid URL" }),
  referrer: z.string(),
  userAgent: z.string(),
  viewport: ViewportSchema,
  sessionId: z.string().uuid({ message: "Must be a valid UUID v4" }),
  trigger: TriggerInfoSchema,
  domPath: z.string(),
});
export type ContextData = z.infer<typeof ContextDataSchema>;

// ========================================
// Feedback Response
// ========================================

export const FeedbackResponseSchema = z.object({
  type: PromptTypeSchema,
  value: z.union([
    z.string(),
    z.number(),
    z.array(z.string()),
  ]),
});
export type FeedbackResponse = z.infer<typeof FeedbackResponseSchema>;

// ========================================
// Feedback Data (POST /feedback request body)
// ========================================

export const FeedbackDataSchema = z.object({
  context: ContextDataSchema,
  response: FeedbackResponseSchema,
});
export type FeedbackData = z.infer<typeof FeedbackDataSchema>;

// ========================================
// Feedback Submission Response
// ========================================

export const FeedbackSubmissionResponseSchema = z.object({
  success: z.literal(true),
  id: z.string(),
});
export type FeedbackSubmissionResponse = z.infer<typeof FeedbackSubmissionResponseSchema>;

// ========================================
// Snapshot Data (POST /snapshots request body)
// ========================================

export const SnapshotDataSchema = z.object({
  html: z.string().min(1, { message: "HTML content is required" }),
  url: z.string().url({ message: "Must be a valid URL" }),
  timestamp: z.string().datetime({ message: "Must be a valid ISO 8601 timestamp" }),
  sessionId: z.string().uuid({ message: "Must be a valid UUID v4" }),
  fingerprint: z.string().min(1, { message: "Fingerprint is required" }),
  title: z.string().optional(),
  viewport: ViewportSchema.optional(),
});
export type SnapshotData = z.infer<typeof SnapshotDataSchema>;

// ========================================
// Prompt Config (server-driven prompt override)
// ========================================

export const PromptConfigSchema = z.object({
  title: z.string(),
  type: PromptTypeSchema,
  options: z.array(z.string()).optional(),
  placeholder: z.string().optional(),
});
export type PromptConfig = z.infer<typeof PromptConfigSchema>;

// ========================================
// Changed Element
// ========================================

export const ChangedElementSchema = z.object({
  selector: z.string(),
  changeType: ChangeTypeSchema,
  metadata: z.record(z.unknown()).optional(),
});
export type ChangedElement = z.infer<typeof ChangedElementSchema>;

// ========================================
// Change Detection Response (POST /snapshots response)
// ========================================

export const ChangeDetectionResponseSchema = z.object({
  hasChanges: z.boolean(),
  changedElements: z.array(ChangedElementSchema),
  promptConfig: PromptConfigSchema.optional(),
});
export type ChangeDetectionResponse = z.infer<typeof ChangeDetectionResponseSchema>;

// ========================================
// Error Response
// ========================================

export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  details: z.array(z.object({
    path: z.array(z.union([z.string(), z.number()])),
    message: z.string(),
  })).optional(),
});
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

// ========================================
// Health Check Response
// ========================================

export const HealthCheckResponseSchema = z.object({
  status: z.literal("ok"),
  timestamp: z.string().datetime(),
  version: z.string(),
});
export type HealthCheckResponse = z.infer<typeof HealthCheckResponseSchema>;

// ========================================
// Stored Feedback (internal representation with id)
// ========================================

export interface StoredFeedback extends FeedbackData {
  id: string;
  receivedAt: string;
}

// ========================================
// Stored Snapshot (internal representation with id)
// ========================================

export interface StoredSnapshot extends SnapshotData {
  id: string;
  receivedAt: string;
}

