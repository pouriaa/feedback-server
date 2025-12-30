/**
 * Integration tests for POST /feedback endpoint
 */

import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../index.js";
import { createFeedbackData, randomSessionId } from "./helpers.js";

describe("POST /feedback", () => {
  it("returns { success: true, id } for valid feedback submission", async () => {
    const feedbackData = createFeedbackData();

    const response = await request(app)
      .post("/feedback")
      .send(feedbackData)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toMatchObject({
      success: true,
      id: expect.any(String),
    });
  });

  it("returns 400 with validation errors for invalid payload", async () => {
    const invalidData = {
      context: {
        // Missing required fields
      },
      response: {
        type: "rating",
        value: 5,
      },
    };

    const response = await request(app)
      .post("/feedback")
      .send(invalidData)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toMatchObject({
      success: false,
      error: "Validation failed",
      details: expect.any(Array),
    });
    expect(response.body.details.length).toBeGreaterThan(0);
  });

  it("returns 400 when required fields are missing", async () => {
    const incompleteData = {
      context: {
        timestamp: new Date().toISOString(),
        url: "https://example.com",
        // Missing: referrer, userAgent, viewport, sessionId, trigger, domPath
      },
      response: {
        type: "rating",
        value: 5,
      },
    };

    const response = await request(app)
      .post("/feedback")
      .send(incompleteData)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.details).toBeDefined();
  });

  it("accepts rating response type correctly", async () => {
    const feedbackData = createFeedbackData({
      responseType: "rating",
      responseValue: 4,
    });

    const response = await request(app)
      .post("/feedback")
      .send(feedbackData)
      .expect(200);

    expect(response.body.success).toBe(true);
  });

  it("accepts choice response type correctly", async () => {
    const feedbackData = createFeedbackData({
      responseType: "choice",
      responseValue: ["option1", "option2"],
    });

    const response = await request(app)
      .post("/feedback")
      .send(feedbackData)
      .expect(200);

    expect(response.body.success).toBe(true);
  });

  it("accepts text response type correctly", async () => {
    const feedbackData = createFeedbackData({
      responseType: "text",
      responseValue: "This is my detailed feedback about the feature.",
    });

    const response = await request(app)
      .post("/feedback")
      .send(feedbackData)
      .expect(200);

    expect(response.body.success).toBe(true);
  });

  it("accepts rageClick trigger type", async () => {
    const feedbackData = createFeedbackData({
      triggerType: "rageClick",
      triggerElement: "button.submit-btn",
    });

    const response = await request(app)
      .post("/feedback")
      .send(feedbackData)
      .expect(200);

    expect(response.body.success).toBe(true);
  });

  it("accepts snapshot trigger type", async () => {
    const feedbackData = createFeedbackData({
      triggerType: "snapshot",
    });

    const response = await request(app)
      .post("/feedback")
      .send(feedbackData)
      .expect(200);

    expect(response.body.success).toBe(true);
  });

  it("stores feedback with unique session IDs separately", async () => {
    const feedbackData1 = createFeedbackData({ sessionId: randomSessionId() });
    const feedbackData2 = createFeedbackData({ sessionId: randomSessionId() });

    const response1 = await request(app)
      .post("/feedback")
      .send(feedbackData1)
      .expect(200);

    const response2 = await request(app)
      .post("/feedback")
      .send(feedbackData2)
      .expect(200);

    expect(response1.body.id).not.toBe(response2.body.id);
  });
});

