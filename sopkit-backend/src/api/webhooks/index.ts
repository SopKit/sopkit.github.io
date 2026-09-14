/**
 * @file sopkit-backend/src/api/webhooks/index.ts
 * @description Webhook receiver router.
 */

import { Hono } from "hono";

export const webhookRouter = new Hono();

webhookRouter.post("/github-sync", async (c) => {
  return c.json({ status: "acknowledged", timestamp: Date.now() });
});
