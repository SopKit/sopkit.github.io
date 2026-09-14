/**
 * @file sopkit-backend/src/api/public/index.ts
 * @description Public API endpoints for search, tool metadata, and health.
 */

import { Hono } from "hono";

export const publicRouter = new Hono();

publicRouter.get("/tools", (c) => {
  return c.json({
    message: "Public tools catalog",
    version: "1.0",
    docs: "https://sopkit.github.io/docs",
  });
});

publicRouter.get("/search", (c) => {
  const query = c.req.query("q") || "";
  return c.json({
    query,
    results: [],
    total: 0,
  });
});
