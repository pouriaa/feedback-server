/**
 * Test data factories for integration tests
 *
 * Creates valid test fixtures matching the Zod schemas
 */

import type { FeedbackData, SnapshotData } from "../types/index.js";

// Test project credentials (set up in vitest.setup.ts)
export const TEST_API_KEY = "pf_test_api_key_for_testing";
export const TEST_PROJECT_ID = "test-project-id-12345";

/**
 * Creates a valid feedback submission payload
 */
export function createFeedbackData(
  overrides: Partial<{
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
  }> = {}
): FeedbackData {
  return {
    context: {
      timestamp: overrides.timestamp ?? new Date().toISOString(),
      url: overrides.url ?? "https://example.com/page",
      referrer: overrides.referrer ?? "https://example.com",
      userAgent: overrides.userAgent ?? "Mozilla/5.0 Test User Agent",
      viewport: {
        width: overrides.viewportWidth ?? 1920,
        height: overrides.viewportHeight ?? 1080,
      },
      sessionId: overrides.sessionId ?? "550e8400-e29b-41d4-a716-446655440000",
      trigger: {
        type: overrides.triggerType ?? "custom",
        element: overrides.triggerElement,
      },
      domPath: overrides.domPath ?? "html > body > div > button",
    },
    response: {
      type: overrides.responseType ?? "rating",
      value: overrides.responseValue ?? 5,
    },
  };
}

/**
 * Creates a valid snapshot submission payload
 */
export function createSnapshotData(
  overrides: Partial<{
    html: string;
    url: string;
    timestamp: string;
    sessionId: string;
    fingerprint: string;
    title: string;
    viewportWidth: number;
    viewportHeight: number;
  }> = {}
): SnapshotData {
  return {
    html: overrides.html ?? "<html><body><h1>Test Page</h1></body></html>",
    url: overrides.url ?? "https://example.com/page",
    timestamp: overrides.timestamp ?? new Date().toISOString(),
    sessionId: overrides.sessionId ?? "550e8400-e29b-41d4-a716-446655440000",
    fingerprint: overrides.fingerprint ?? "abc123fingerprint",
    title: overrides.title,
    viewport: overrides.viewportWidth
      ? {
          width: overrides.viewportWidth,
          height: overrides.viewportHeight ?? 1080,
        }
      : undefined,
  };
}

/**
 * Generates a random UUID v4
 */
export function randomSessionId(): string {
  return crypto.randomUUID();
}
