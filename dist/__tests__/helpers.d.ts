/**
 * Test data factories for integration tests
 *
 * Creates valid test fixtures matching the Zod schemas
 */
import type { FeedbackData, SnapshotData } from "../types/index.js";
export declare const TEST_API_KEY = "pf_test_api_key_for_testing";
export declare const TEST_PROJECT_ID = "test-project-id-12345";
/**
 * Creates a valid feedback submission payload
 */
export declare function createFeedbackData(overrides?: Partial<{
    timestamp: string;
    url: string;
    referrer: string;
    userAgent: string;
    sessionId: string;
    domPath: string;
    viewportWidth: number;
    viewportHeight: number;
    triggerType: "rageClick" | "custom" | "snapshot";
    triggerElement: string;
    responseType: "rating" | "choice" | "text";
    responseValue: string | number | string[];
}>): FeedbackData;
/**
 * Creates a valid snapshot submission payload
 */
export declare function createSnapshotData(overrides?: Partial<{
    html: string;
    url: string;
    timestamp: string;
    sessionId: string;
    fingerprint: string;
    title: string;
    viewportWidth: number;
    viewportHeight: number;
}>): SnapshotData;
/**
 * Generates a random UUID v4
 */
export declare function randomSessionId(): string;
//# sourceMappingURL=helpers.d.ts.map