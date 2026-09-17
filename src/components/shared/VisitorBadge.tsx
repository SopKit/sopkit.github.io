import * as React from "react";
import { cn } from "@/lib/utils";

interface VisitorBadgeProps {
  /** Path to track (e.g. "/love-calculator" or full URL). If omitted or "global", tracks root domain. */
  path?: string;
  /** Optional label text or tooltip descriptor */
  label?: string;
  /** Background hex color for the count side (default: "#263759"). */
  countColor?: string;
  /** Badge visual style (default: "flat"). */
  style?: "flat" | "plastic";
  className?: string;
}

/**
 * VisitorBadge Component — displays a live visitor hit counter from visitorbadge.io using /api/combined.
 * Links to https://visitorbadge.io/status?path=...
 */
export function VisitorBadge({
  path,
  label = "Visitors",
  countColor = "%23263759",
  style = "flat",
  className,
}: VisitorBadgeProps) {
  // Normalize target URL with trailing slash
  let targetUrl = "https://sopkit.space/";
  if (path && path !== "/" && path !== "global") {
    if (path.startsWith("http://") || path.startsWith("https://")) {
      targetUrl = path.endsWith("/") ? path : `${path}/`;
    } else {
      const cleanPath = path.replace(/^\/+/, "").replace(/\/+$/, "");
      targetUrl = `https://sopkit.space/${cleanPath}/`;
    }
  }

  const encodedPath = encodeURIComponent(targetUrl);
  // Ensure %23 is formatted properly if raw hex passed
  const formattedCountColor = countColor.startsWith("#")
    ? encodeURIComponent(countColor)
    : countColor;

  const statusUrl = `https://visitorbadge.io/status?path=${encodedPath}`;
  const badgeImageUrl = `https://api.visitorbadge.io/api/combined?path=${encodedPath}&countColor=${formattedCountColor}&style=${style}`;

  return (
    <a
      href={statusUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded",
        className
      )}
      title={`Visitor Analytics for ${targetUrl}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={badgeImageUrl}
        alt="Visitors Counter"
        loading="lazy"
        decoding="async"
        className="h-5 w-auto rounded"
      />
    </a>
  );
}
