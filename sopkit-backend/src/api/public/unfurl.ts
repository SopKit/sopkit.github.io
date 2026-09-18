/**
 * @file sopkit-backend/src/api/public/unfurl.ts
 * @description Edge metadata & OpenGraph unfurler with strict SSRF defenses.
 */

import { Hono } from "hono";
import { z } from "zod";

export const unfurlRouter = new Hono();

const UnfurlQuerySchema = z.object({
  url: z.string().url().max(1000),
});

// SSRF Defense
function isForbiddenHost(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  if (
    lower === "localhost" ||
    lower.endsWith(".local") ||
    lower.endsWith(".internal") ||
    lower.endsWith(".lan") ||
    lower === "127.0.0.1" ||
    lower === "::1" ||
    lower === "0.0.0.0"
  ) {
    return true;
  }

  // IPv4 Private subnets
  const ipv4Match = lower.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (ipv4Match) {
    const octet1 = parseInt(ipv4Match[1], 10);
    const octet2 = parseInt(ipv4Match[2], 10);

    if (octet1 === 10) return true; // 10.0.0.0/8
    if (octet1 === 127) return true; // Loopback
    if (octet1 === 169 && octet2 === 254) return true; // Link-local / Cloud metadata (169.254.169.254)
    if (octet1 === 172 && octet2 >= 16 && octet2 <= 31) return true; // 172.16.0.0/12
    if (octet1 === 192 && octet2 === 168) return true; // 192.168.0.0/16
  }

  return false;
}

unfurlRouter.get("/", async (c) => {
  const rawUrl = c.req.query("url");
  const parsed = UnfurlQuerySchema.safeParse({ url: rawUrl });

  if (!parsed.success) {
    return c.json({ error: "Missing or invalid 'url' parameter" }, 400);
  }

  try {
    const targetUrl = new URL(parsed.data.url);

    if (isForbiddenHost(targetUrl.hostname)) {
      return c.json({ error: "Forbidden target address (SSRF protection)" }, 403);
    }

    if (!["http:", "https:"].includes(targetUrl.protocol)) {
      return c.json({ error: "Unsupported protocol" }, 400);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(targetUrl.toString(), {
      signal: controller.signal,
      headers: {
        "User-Agent": "SopKit-Bot/1.0 (+https://sopkit.space/bot)",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("html")) {
      return c.json({
        url: targetUrl.toString(),
        statusCode: response.status,
        contentType,
        title: targetUrl.hostname,
      });
    }

    const html = await response.text();

    // Regex extraction
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : "";

    const getMeta = (prop: string) => {
      const match =
        html.match(new RegExp(`<meta[^>]*property=["']${prop}["'][^>]*content=["']([^"']*)["']`, "i")) ||
        html.match(new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${prop}["']`, "i")) ||
        html.match(new RegExp(`<meta[^>]*name=["']${prop}["'][^>]*content=["']([^"']*)["']`, "i")) ||
        html.match(new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${prop}["']`, "i"));
      return match ? match[1].trim() : null;
    };

    const description = getMeta("description") || getMeta("og:description") || "";
    const ogImage = getMeta("og:image") || getMeta("twitter:image") || null;
    const ogTitle = getMeta("og:title") || title;
    const siteName = getMeta("og:site_name") || targetUrl.hostname;

    // Resolve relative og:image URL
    let resolvedImage = ogImage;
    if (ogImage && !ogImage.startsWith("http")) {
      try {
        resolvedImage = new URL(ogImage, targetUrl).toString();
      } catch {
        resolvedImage = ogImage;
      }
    }

    const faviconMatch = html.match(/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']*)["']/i);
    let favicon = faviconMatch ? faviconMatch[1].trim() : "/favicon.ico";
    if (favicon && !favicon.startsWith("http")) {
      try {
        favicon = new URL(favicon, targetUrl).toString();
      } catch {
        // keep as is
      }
    }

    return c.json({
      url: targetUrl.toString(),
      statusCode: response.status,
      title: ogTitle || title,
      description,
      image: resolvedImage,
      favicon,
      siteName,
    }, 200, {
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to unfurl URL";
    return c.json({ error: msg }, 502);
  }
});
