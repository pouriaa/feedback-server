/**
 * Server-side type definitions and Zod schemas for Product Feedback API
 * These schemas match the frontend contracts defined in @product-feedback/core
 */
import { z } from "zod";
export declare const TriggerTypeSchema: z.ZodEnum<["rageClick", "custom", "snapshot"]>;
export type TriggerType = z.infer<typeof TriggerTypeSchema>;
export declare const PromptTypeSchema: z.ZodEnum<["rating", "choice", "text"]>;
export type PromptType = z.infer<typeof PromptTypeSchema>;
export declare const ChangeTypeSchema: z.ZodEnum<["added", "modified", "removed"]>;
export type ChangeType = z.infer<typeof ChangeTypeSchema>;
export declare const ViewportSchema: z.ZodObject<{
    width: z.ZodNumber;
    height: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    width: number;
    height: number;
}, {
    width: number;
    height: number;
}>;
export type Viewport = z.infer<typeof ViewportSchema>;
export declare const CoordinatesSchema: z.ZodObject<{
    x: z.ZodNumber;
    y: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    x: number;
    y: number;
}, {
    x: number;
    y: number;
}>;
export type Coordinates = z.infer<typeof CoordinatesSchema>;
export declare const TriggerInfoSchema: z.ZodObject<{
    type: z.ZodEnum<["rageClick", "custom", "snapshot"]>;
    element: z.ZodOptional<z.ZodString>;
    coordinates: z.ZodOptional<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    type: "rageClick" | "custom" | "snapshot";
    element?: string | undefined;
    coordinates?: {
        x: number;
        y: number;
    } | undefined;
}, {
    type: "rageClick" | "custom" | "snapshot";
    element?: string | undefined;
    coordinates?: {
        x: number;
        y: number;
    } | undefined;
}>;
export type TriggerInfo = z.infer<typeof TriggerInfoSchema>;
export declare const ContextDataSchema: z.ZodObject<{
    timestamp: z.ZodString;
    url: z.ZodString;
    referrer: z.ZodString;
    userAgent: z.ZodString;
    viewport: z.ZodObject<{
        width: z.ZodNumber;
        height: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        width: number;
        height: number;
    }, {
        width: number;
        height: number;
    }>;
    sessionId: z.ZodString;
    trigger: z.ZodObject<{
        type: z.ZodEnum<["rageClick", "custom", "snapshot"]>;
        element: z.ZodOptional<z.ZodString>;
        coordinates: z.ZodOptional<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
        }, {
            x: number;
            y: number;
        }>>;
    }, "strip", z.ZodTypeAny, {
        type: "rageClick" | "custom" | "snapshot";
        element?: string | undefined;
        coordinates?: {
            x: number;
            y: number;
        } | undefined;
    }, {
        type: "rageClick" | "custom" | "snapshot";
        element?: string | undefined;
        coordinates?: {
            x: number;
            y: number;
        } | undefined;
    }>;
    domPath: z.ZodString;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    url: string;
    referrer: string;
    userAgent: string;
    viewport: {
        width: number;
        height: number;
    };
    sessionId: string;
    trigger: {
        type: "rageClick" | "custom" | "snapshot";
        element?: string | undefined;
        coordinates?: {
            x: number;
            y: number;
        } | undefined;
    };
    domPath: string;
}, {
    timestamp: string;
    url: string;
    referrer: string;
    userAgent: string;
    viewport: {
        width: number;
        height: number;
    };
    sessionId: string;
    trigger: {
        type: "rageClick" | "custom" | "snapshot";
        element?: string | undefined;
        coordinates?: {
            x: number;
            y: number;
        } | undefined;
    };
    domPath: string;
}>;
export type ContextData = z.infer<typeof ContextDataSchema>;
export declare const FeedbackResponseSchema: z.ZodObject<{
    type: z.ZodEnum<["rating", "choice", "text"]>;
    value: z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodArray<z.ZodString, "many">]>;
}, "strip", z.ZodTypeAny, {
    value: string | number | string[];
    type: "rating" | "choice" | "text";
}, {
    value: string | number | string[];
    type: "rating" | "choice" | "text";
}>;
export type FeedbackResponse = z.infer<typeof FeedbackResponseSchema>;
export declare const FeedbackDataSchema: z.ZodObject<{
    context: z.ZodObject<{
        timestamp: z.ZodString;
        url: z.ZodString;
        referrer: z.ZodString;
        userAgent: z.ZodString;
        viewport: z.ZodObject<{
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            width: number;
            height: number;
        }, {
            width: number;
            height: number;
        }>;
        sessionId: z.ZodString;
        trigger: z.ZodObject<{
            type: z.ZodEnum<["rageClick", "custom", "snapshot"]>;
            element: z.ZodOptional<z.ZodString>;
            coordinates: z.ZodOptional<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                x: number;
                y: number;
            }, {
                x: number;
                y: number;
            }>>;
        }, "strip", z.ZodTypeAny, {
            type: "rageClick" | "custom" | "snapshot";
            element?: string | undefined;
            coordinates?: {
                x: number;
                y: number;
            } | undefined;
        }, {
            type: "rageClick" | "custom" | "snapshot";
            element?: string | undefined;
            coordinates?: {
                x: number;
                y: number;
            } | undefined;
        }>;
        domPath: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        timestamp: string;
        url: string;
        referrer: string;
        userAgent: string;
        viewport: {
            width: number;
            height: number;
        };
        sessionId: string;
        trigger: {
            type: "rageClick" | "custom" | "snapshot";
            element?: string | undefined;
            coordinates?: {
                x: number;
                y: number;
            } | undefined;
        };
        domPath: string;
    }, {
        timestamp: string;
        url: string;
        referrer: string;
        userAgent: string;
        viewport: {
            width: number;
            height: number;
        };
        sessionId: string;
        trigger: {
            type: "rageClick" | "custom" | "snapshot";
            element?: string | undefined;
            coordinates?: {
                x: number;
                y: number;
            } | undefined;
        };
        domPath: string;
    }>;
    response: z.ZodObject<{
        type: z.ZodEnum<["rating", "choice", "text"]>;
        value: z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodArray<z.ZodString, "many">]>;
    }, "strip", z.ZodTypeAny, {
        value: string | number | string[];
        type: "rating" | "choice" | "text";
    }, {
        value: string | number | string[];
        type: "rating" | "choice" | "text";
    }>;
}, "strip", z.ZodTypeAny, {
    context: {
        timestamp: string;
        url: string;
        referrer: string;
        userAgent: string;
        viewport: {
            width: number;
            height: number;
        };
        sessionId: string;
        trigger: {
            type: "rageClick" | "custom" | "snapshot";
            element?: string | undefined;
            coordinates?: {
                x: number;
                y: number;
            } | undefined;
        };
        domPath: string;
    };
    response: {
        value: string | number | string[];
        type: "rating" | "choice" | "text";
    };
}, {
    context: {
        timestamp: string;
        url: string;
        referrer: string;
        userAgent: string;
        viewport: {
            width: number;
            height: number;
        };
        sessionId: string;
        trigger: {
            type: "rageClick" | "custom" | "snapshot";
            element?: string | undefined;
            coordinates?: {
                x: number;
                y: number;
            } | undefined;
        };
        domPath: string;
    };
    response: {
        value: string | number | string[];
        type: "rating" | "choice" | "text";
    };
}>;
export type FeedbackData = z.infer<typeof FeedbackDataSchema>;
export declare const FeedbackSubmissionResponseSchema: z.ZodObject<{
    success: z.ZodLiteral<true>;
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    success: true;
    id: string;
}, {
    success: true;
    id: string;
}>;
export type FeedbackSubmissionResponse = z.infer<typeof FeedbackSubmissionResponseSchema>;
export declare const SnapshotDataSchema: z.ZodObject<{
    html: z.ZodString;
    url: z.ZodString;
    timestamp: z.ZodString;
    sessionId: z.ZodString;
    fingerprint: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    viewport: z.ZodOptional<z.ZodObject<{
        width: z.ZodNumber;
        height: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        width: number;
        height: number;
    }, {
        width: number;
        height: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    url: string;
    sessionId: string;
    html: string;
    fingerprint: string;
    viewport?: {
        width: number;
        height: number;
    } | undefined;
    title?: string | undefined;
}, {
    timestamp: string;
    url: string;
    sessionId: string;
    html: string;
    fingerprint: string;
    viewport?: {
        width: number;
        height: number;
    } | undefined;
    title?: string | undefined;
}>;
export type SnapshotData = z.infer<typeof SnapshotDataSchema>;
export declare const PromptConfigSchema: z.ZodObject<{
    title: z.ZodString;
    type: z.ZodEnum<["rating", "choice", "text"]>;
    options: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    placeholder: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "rating" | "choice" | "text";
    title: string;
    options?: string[] | undefined;
    placeholder?: string | undefined;
}, {
    type: "rating" | "choice" | "text";
    title: string;
    options?: string[] | undefined;
    placeholder?: string | undefined;
}>;
export type PromptConfig = z.infer<typeof PromptConfigSchema>;
export declare const ChangedElementSchema: z.ZodObject<{
    selector: z.ZodString;
    changeType: z.ZodEnum<["added", "modified", "removed"]>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    selector: string;
    changeType: "added" | "modified" | "removed";
    metadata?: Record<string, unknown> | undefined;
}, {
    selector: string;
    changeType: "added" | "modified" | "removed";
    metadata?: Record<string, unknown> | undefined;
}>;
export type ChangedElement = z.infer<typeof ChangedElementSchema>;
export declare const ChangeDetectionResponseSchema: z.ZodObject<{
    hasChanges: z.ZodBoolean;
    changedElements: z.ZodArray<z.ZodObject<{
        selector: z.ZodString;
        changeType: z.ZodEnum<["added", "modified", "removed"]>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        selector: string;
        changeType: "added" | "modified" | "removed";
        metadata?: Record<string, unknown> | undefined;
    }, {
        selector: string;
        changeType: "added" | "modified" | "removed";
        metadata?: Record<string, unknown> | undefined;
    }>, "many">;
    promptConfig: z.ZodOptional<z.ZodObject<{
        title: z.ZodString;
        type: z.ZodEnum<["rating", "choice", "text"]>;
        options: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        placeholder: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "rating" | "choice" | "text";
        title: string;
        options?: string[] | undefined;
        placeholder?: string | undefined;
    }, {
        type: "rating" | "choice" | "text";
        title: string;
        options?: string[] | undefined;
        placeholder?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    hasChanges: boolean;
    changedElements: {
        selector: string;
        changeType: "added" | "modified" | "removed";
        metadata?: Record<string, unknown> | undefined;
    }[];
    promptConfig?: {
        type: "rating" | "choice" | "text";
        title: string;
        options?: string[] | undefined;
        placeholder?: string | undefined;
    } | undefined;
}, {
    hasChanges: boolean;
    changedElements: {
        selector: string;
        changeType: "added" | "modified" | "removed";
        metadata?: Record<string, unknown> | undefined;
    }[];
    promptConfig?: {
        type: "rating" | "choice" | "text";
        title: string;
        options?: string[] | undefined;
        placeholder?: string | undefined;
    } | undefined;
}>;
export type ChangeDetectionResponse = z.infer<typeof ChangeDetectionResponseSchema>;
export declare const ErrorResponseSchema: z.ZodObject<{
    success: z.ZodLiteral<false>;
    error: z.ZodString;
    details: z.ZodOptional<z.ZodArray<z.ZodObject<{
        path: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>, "many">;
        message: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        path: (string | number)[];
        message: string;
    }, {
        path: (string | number)[];
        message: string;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    success: false;
    error: string;
    details?: {
        path: (string | number)[];
        message: string;
    }[] | undefined;
}, {
    success: false;
    error: string;
    details?: {
        path: (string | number)[];
        message: string;
    }[] | undefined;
}>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export declare const HealthCheckResponseSchema: z.ZodObject<{
    status: z.ZodLiteral<"ok">;
    timestamp: z.ZodString;
    version: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "ok";
    timestamp: string;
    version: string;
}, {
    status: "ok";
    timestamp: string;
    version: string;
}>;
export type HealthCheckResponse = z.infer<typeof HealthCheckResponseSchema>;
export interface StoredFeedback extends FeedbackData {
    id: string;
    receivedAt: string;
}
export interface StoredSnapshot extends SnapshotData {
    id: string;
    receivedAt: string;
}
//# sourceMappingURL=index.d.ts.map