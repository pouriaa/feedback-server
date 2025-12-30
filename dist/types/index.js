/**
 * Server-side type definitions and Zod schemas for Product Feedback API
 * These schemas match the frontend contracts defined in @product-feedback/core
 */
import { z } from "zod";
// ========================================
// Enums and Literals
// ========================================
export const TriggerTypeSchema = z.enum(["rageClick", "custom", "snapshot"]);
export const PromptTypeSchema = z.enum(["rating", "choice", "text"]);
export const ChangeTypeSchema = z.enum(["added", "modified", "removed"]);
// ========================================
// Shared Schemas
// ========================================
export const ViewportSchema = z.object({
    width: z.number().int().nonnegative(),
    height: z.number().int().nonnegative(),
});
export const CoordinatesSchema = z.object({
    x: z.number(),
    y: z.number(),
});
// ========================================
// Trigger Info
// ========================================
export const TriggerInfoSchema = z.object({
    type: TriggerTypeSchema,
    element: z.string().optional(),
    coordinates: CoordinatesSchema.optional(),
});
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
// ========================================
// Feedback Data (POST /feedback request body)
// ========================================
export const FeedbackDataSchema = z.object({
    context: ContextDataSchema,
    response: FeedbackResponseSchema,
});
// ========================================
// Feedback Submission Response
// ========================================
export const FeedbackSubmissionResponseSchema = z.object({
    success: z.literal(true),
    id: z.string(),
});
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
// ========================================
// Prompt Config (server-driven prompt override)
// ========================================
export const PromptConfigSchema = z.object({
    title: z.string(),
    type: PromptTypeSchema,
    options: z.array(z.string()).optional(),
    placeholder: z.string().optional(),
});
// ========================================
// Changed Element
// ========================================
export const ChangedElementSchema = z.object({
    selector: z.string(),
    changeType: ChangeTypeSchema,
    metadata: z.record(z.unknown()).optional(),
});
// ========================================
// Change Detection Response (POST /snapshots response)
// ========================================
export const ChangeDetectionResponseSchema = z.object({
    hasChanges: z.boolean(),
    changedElements: z.array(ChangedElementSchema),
    promptConfig: PromptConfigSchema.optional(),
});
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
// ========================================
// Health Check Response
// ========================================
export const HealthCheckResponseSchema = z.object({
    status: z.literal("ok"),
    timestamp: z.string().datetime(),
    version: z.string(),
});
//# sourceMappingURL=index.js.map