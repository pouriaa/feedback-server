/**
 * Integration tests for POST /snapshots endpoint
 */

import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../index.js";
import { createSnapshotData, randomSessionId, TEST_API_KEY } from "./helpers.js";

describe("POST /snapshots", () => {
  it("returns { hasChanges: false } for first snapshot", async () => {
    const snapshotData = createSnapshotData({
      sessionId: randomSessionId(),
      url: "https://example.com/first-test",
    });

    const response = await request(app)
      .post("/snapshots")
      .set("X-API-Key", TEST_API_KEY)
      .send(snapshotData)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toMatchObject({
      hasChanges: false,
      changedElements: [],
    });
  });

  it("returns { hasChanges: false } for same fingerprint", async () => {
    const sessionId = randomSessionId();
    const url = "https://example.com/same-fingerprint-test";
    const fingerprint = "same-fingerprint-123";

    // First submission
    const firstSnapshot = createSnapshotData({
      sessionId,
      url,
      fingerprint,
    });

    await request(app)
      .post("/snapshots")
      .set("X-API-Key", TEST_API_KEY)
      .send(firstSnapshot)
      .expect(200);

    // Second submission with same fingerprint
    const secondSnapshot = createSnapshotData({
      sessionId,
      url,
      fingerprint,
    });

    const response = await request(app)
      .post("/snapshots")
      .set("X-API-Key", TEST_API_KEY)
      .send(secondSnapshot)
      .expect(200);

    expect(response.body).toMatchObject({
      hasChanges: false,
      changedElements: [],
    });
  });

  it("returns { hasChanges: true } for different fingerprint", async () => {
    const sessionId = randomSessionId();
    const url = "https://example.com/different-fingerprint-test";

    // First submission
    const firstSnapshot = createSnapshotData({
      sessionId,
      url,
      fingerprint: "original-fingerprint",
      html: "<html><body><h1>Original</h1></body></html>",
    });

    await request(app)
      .post("/snapshots")
      .set("X-API-Key", TEST_API_KEY)
      .send(firstSnapshot)
      .expect(200);

    // Second submission with different fingerprint
    const secondSnapshot = createSnapshotData({
      sessionId,
      url,
      fingerprint: "changed-fingerprint",
      html: "<html><body><h1>Changed</h1><p>New content</p></body></html>",
    });

    const response = await request(app)
      .post("/snapshots")
      .set("X-API-Key", TEST_API_KEY)
      .send(secondSnapshot)
      .expect(200);

    expect(response.body.hasChanges).toBe(true);
    expect(Array.isArray(response.body.changedElements)).toBe(true);
  });

  it("returns 401 when API key is missing", async () => {
    const snapshotData = createSnapshotData({
      sessionId: randomSessionId(),
    });

    const response = await request(app)
      .post("/snapshots")
      .send(snapshotData)
      .expect("Content-Type", /json/)
      .expect(401);

    expect(response.body).toMatchObject({
      success: false,
      error: "API key required",
    });
  });

  it("returns 401 for invalid API key", async () => {
    const snapshotData = createSnapshotData({
      sessionId: randomSessionId(),
    });

    const response = await request(app)
      .post("/snapshots")
      .set("X-API-Key", "invalid-api-key")
      .send(snapshotData)
      .expect("Content-Type", /json/)
      .expect(401);

    expect(response.body).toMatchObject({
      success: false,
      error: "Invalid API key",
    });
  });

  it("returns 400 for invalid payload", async () => {
    const invalidData = {
      // Missing required fields
      url: "https://example.com",
    };

    const response = await request(app)
      .post("/snapshots")
      .set("X-API-Key", TEST_API_KEY)
      .send(invalidData)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toMatchObject({
      success: false,
      error: "Validation failed",
      details: expect.any(Array),
    });
  });

  it("returns 400 when HTML is empty", async () => {
    const snapshotData = createSnapshotData({
      html: "", // Empty HTML should fail validation
    });

    const response = await request(app)
      .post("/snapshots")
      .set("X-API-Key", TEST_API_KEY)
      .send(snapshotData)
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  it("returns 400 when sessionId is not a valid UUID", async () => {
    const snapshotData = createSnapshotData({
      sessionId: "not-a-valid-uuid",
    });

    const response = await request(app)
      .post("/snapshots")
      .set("X-API-Key", TEST_API_KEY)
      .send(snapshotData)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.details).toBeDefined();
  });

  it("returns 400 when URL is not valid", async () => {
    const snapshotData = createSnapshotData({
      url: "not-a-valid-url",
    });

    const response = await request(app)
      .post("/snapshots")
      .set("X-API-Key", TEST_API_KEY)
      .send(snapshotData)
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  it("accepts optional viewport data", async () => {
    const snapshotData = createSnapshotData({
      sessionId: randomSessionId(),
      url: "https://example.com/viewport-test",
      viewportWidth: 1920,
      viewportHeight: 1080,
    });

    const response = await request(app)
      .post("/snapshots")
      .set("X-API-Key", TEST_API_KEY)
      .send(snapshotData)
      .expect(200);

    expect(response.body.hasChanges).toBe(false);
  });

  it("accepts optional title", async () => {
    const snapshotData = createSnapshotData({
      sessionId: randomSessionId(),
      url: "https://example.com/title-test",
      title: "My Page Title",
    });

    const response = await request(app)
      .post("/snapshots")
      .set("X-API-Key", TEST_API_KEY)
      .send(snapshotData)
      .expect(200);

    expect(response.body.hasChanges).toBe(false);
  });
});
