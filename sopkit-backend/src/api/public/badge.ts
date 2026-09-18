/**
 * @file sopkit-backend/src/api/public/badge.ts
 * @description Dynamic SVG shield badge generator for READMEs, documentation, and status monitoring.
 */

import { Hono } from "hono";

export const badgeRouter = new Hono();

const COLOR_MAP: Record<string, string> = {
  brightgreen: "#4c1",
  green: "#97CA00",
  yellowgreen: "#a4a61d",
  yellow: "#dfb317",
  orange: "#fe7d37",
  red: "#e05d44",
  blue: "#007ec6",
  cyan: "#00b4d8",
  purple: "#8a2be2",
  pink: "#ff69b4",
  gray: "#555",
  darkgray: "#333",
  black: "#222",
  sopkit: "#6366f1",
};

badgeRouter.get("/", (c) => {
  const label = c.req.query("label") || "sopkit";
  const message = c.req.query("message") || "online";
  const colorQuery = (c.req.query("color") || "sopkit").toLowerCase();
  const color = COLOR_MAP[colorQuery] || (colorQuery.startsWith("#") ? colorQuery : `#${colorQuery}`);
  const style = c.req.query("style") || "flat"; // flat or pill

  // Estimate text width
  const labelWidth = Math.max(30, label.length * 7.2 + 10);
  const messageWidth = Math.max(30, message.length * 7.2 + 10);
  const totalWidth = Math.round(labelWidth + messageWidth);
  const height = 20;
  const radius = style === "pill" ? 10 : 3;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}" role="img" aria-label="${label}: ${message}">
  <title>${label}: ${message}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#fff" stop-opacity=".7"/>
    <stop offset=".1" stop-color="#aaa" stop-opacity=".1"/>
    <stop offset=".9" stop-color="#000" stop-opacity=".3"/>
    <stop offset="1" stop-color="#000" stop-opacity=".5"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="${height}" rx="${radius}" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="${height}" fill="#555"/>
    <rect x="${labelWidth}" width="${messageWidth}" height="${height}" fill="${color}"/>
    <rect width="${totalWidth}" height="${height}" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
    <text aria-hidden="true" x="${Math.round(labelWidth * 5)}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)">${escapeXml(label)}</text>
    <text x="${Math.round(labelWidth * 5)}" y="140" transform="scale(.1)" fill="#fff">${escapeXml(label)}</text>
    <text aria-hidden="true" x="${Math.round((labelWidth + messageWidth / 2) * 10)}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)">${escapeXml(message)}</text>
    <text x="${Math.round((labelWidth + messageWidth / 2) * 10)}" y="140" transform="scale(.1)" fill="#fff">${escapeXml(message)}</text>
  </g>
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
});

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}
