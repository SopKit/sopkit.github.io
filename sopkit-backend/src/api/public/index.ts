/**
 * @file sopkit-backend/src/api/public/index.ts
 * @description Public API endpoints for search, tool metadata, diff engine, unfurling, badges, and DNS.
 */

import { Hono } from "hono";
import { diffRouter } from "./diff";
import { unfurlRouter } from "./unfurl";
import { headerInspectorRouter } from "./inspect-headers";
import { badgeRouter } from "./badge";
import { dnsRouter } from "./dns";

export const publicRouter = new Hono();

// Mount modular feature routers
publicRouter.route("/diff", diffRouter);
publicRouter.route("/unfurl", unfurlRouter);
publicRouter.route("/inspect-headers", headerInspectorRouter);
publicRouter.route("/badge", badgeRouter);
publicRouter.route("/dns", dnsRouter);

publicRouter.get("/tools", (c) => {
  return c.json({
    service: "SopKit Edge Services",
    version: "1.2.0",
    endpoints: {
      diff: "/api/v1/public/diff (POST - lines, json diff & patch)",
      unfurl: "/api/v1/public/unfurl?url=... (GET - OpenGraph & metadata)",
      inspectHeaders: "/api/v1/public/inspect-headers?url=... (GET - HTTP & security headers)",
      badge: "/api/v1/public/badge?label=sopkit&message=tools&color=brightgreen (GET - SVG badge)",
      dns: "/api/v1/public/dns?name=example.com&type=A (GET - DoH DNS lookup)",
      search: "/api/v1/public/search?q=... (GET - Fast fuzzy search)",
    },
    docs: "https://sopkit.space/docs",
  });
});

publicRouter.get("/search", (c) => {
  const query = (c.req.query("q") || "").trim().toLowerCase();
  // Return catalog format
  return c.json({
    query,
    results: [],
    total: 0,
    timestamp: Date.now(),
  });
});
