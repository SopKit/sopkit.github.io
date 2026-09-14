/**
 * @file sopkit-backend/src/api/internal/index.ts
 * @description Internal API endpoints for telemetry and system health.
 */

import { Hono } from "hono";

export const internalRouter = new Hono();

internalRouter.post("/telemetry/vitals", async (c) => {
  const body = await c.req.json();
  // Telemetry aggregation logic
  return c.json({ received: true, metric: body.name || "unknown" });
});
