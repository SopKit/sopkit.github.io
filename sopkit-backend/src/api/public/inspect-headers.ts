/**
 * @file sopkit-backend/src/api/public/inspect-headers.ts
 * @description Edge API to inspect HTTP response headers, CORS settings, and security posture.
 */

import { Hono } from "hono";
import { z } from "zod";

export const headerInspectorRouter = new Hono();

const InspectQuerySchema = z.object({
  url: z.string().url().max(1000),
});

headerInspectorRouter.get("/", async (c) => {
  const rawUrl = c.req.query("url");
  const parsed = InspectQuerySchema.safeParse({ url: rawUrl });

  if (!parsed.success) {
    return c.json({ error: "Missing or invalid 'url' parameter" }, 400);
  }

  try {
    const target = new URL(parsed.data.url);
    const start = performance.now();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const res = await fetch(target.toString(), {
      method: "GET",
      signal: controller.signal,
      headers: {
        "User-Agent": "SopKit-Header-Inspector/1.0",
      },
    });

    clearTimeout(timeout);
    const latencyMs = Math.round(performance.now() - start);

    const headers: Record<string, string> = {};
    res.headers.forEach((val, key) => {
      headers[key.toLowerCase()] = val;
    });

    // Evaluate Security Headers
    const securityCheck = {
      hasHSTS: Boolean(headers["strict-transport-security"]),
      hasCSP: Boolean(headers["content-security-policy"]),
      hasXFrameOptions: Boolean(headers["x-frame-options"]),
      hasContentTypeOptions: headers["x-content-type-options"] === "nosniff",
      hasReferrerPolicy: Boolean(headers["referrer-policy"]),
      hasPermissionsPolicy: Boolean(headers["permissions-policy"]),
      corsHeader: headers["access-control-allow-origin"] || "none",
    };

    let score = 0;
    if (securityCheck.hasHSTS) score += 25;
    if (securityCheck.hasCSP) score += 25;
    if (securityCheck.hasXFrameOptions) score += 15;
    if (securityCheck.hasContentTypeOptions) score += 15;
    if (securityCheck.hasReferrerPolicy) score += 10;
    if (securityCheck.hasPermissionsPolicy) score += 10;

    let grade = "F";
    if (score >= 90) grade = "A+";
    else if (score >= 75) grade = "A";
    else if (score >= 60) grade = "B";
    else if (score >= 40) grade = "C";
    else if (score >= 20) grade = "D";

    return c.json({
      targetUrl: target.toString(),
      statusCode: res.status,
      statusText: res.statusText,
      latencyMs,
      grade,
      score,
      securityCheck,
      allHeaders: headers,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Header inspection failed";
    return c.json({ error: msg }, 502);
  }
});
