/**
 * @file sopkit-backend/src/index.ts
 * @description Edge API entrypoint for SopKit Backend service.
 */

import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { publicRouter } from "./api/public";
import { internalRouter } from "./api/internal";
import { webhookRouter } from "./api/webhooks";

const app = new Hono();

// Global middleware
app.use("*", cors({
  origin: ["https://sopkit.space", "https://sopkit.github.io", "http://localhost:3000"],
  allowMethods: ["GET", "POST", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
  maxAge: 86400,
}));

app.use("*", secureHeaders());

// Healthcheck
app.get("/health", (c) => {
  return c.json({ status: "healthy", timestamp: new Date().toISOString(), service: "sopkit-backend" });
});

// Mount modular sub-routers
app.route("/api/v1/public", publicRouter);
app.route("/api/v1/internal", internalRouter);
app.route("/api/v1/webhooks", webhookRouter);

export default app;
