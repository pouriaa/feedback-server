/**
 * Integration tests for GET /health endpoint
 */

import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../index.js";

describe("GET /health", () => {
  it("returns 200 with status ok", async () => {
    const response = await request(app)
      .get("/health")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toMatchObject({
      status: "ok",
      timestamp: expect.any(String),
      version: expect.any(String),
    });
  });

  it("returns a valid ISO 8601 timestamp", async () => {
    const response = await request(app).get("/health").expect(200);

    const timestamp = new Date(response.body.timestamp);
    expect(timestamp.toISOString()).toBe(response.body.timestamp);
  });

  it("returns version 0.0.1", async () => {
    const response = await request(app).get("/health").expect(200);

    expect(response.body.version).toBe("0.0.1");
  });
});

