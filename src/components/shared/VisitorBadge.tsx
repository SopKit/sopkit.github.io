import * as React from "react";
import { cn } from "@/lib/utils";

interface VisitorBadgeProps {
  /** Path to track (e.g. "/image-compressor" or full URL). If omitted, tracks global domain. */
  path?: string;
  /** Custom label (default: "VISITORS" or "PAGE VIEWS"). */
  label?: string;
  /** Background hex color for the left label side (default: "#0f172a"). */
  labelColor?: string;
  /** Background hex color for the right count side (default: "#0284c7"). */
  countColor?: string;
  className?: string;
}

/**
 * VisitorBadge Component — displays a live visitor hit counter from visitorbadge.io.
 * Supports both global domain tracking and per-page unique URL tracking.
 */
export function VisitorBadge({
  path,
  label = "VISITORS",
  labelColor = "#0f172a",
  countColor = "#0284c7",
  className,
}: VisitorBadgeProps) {
  // Normalize target URL for consistent tracking
  let targetUrl = "https://sopkit.space";
  if (path && path !== "/" && path !== "global") {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    targetUrl = `https://sopkit.space${cleanPath}`;
  }

  const encodedPath = encodeURIComponent(targetUrl);
  const encodedLabel = encodeURIComponent(label);
  const encodedLabelColor = encodeURIComponent(labelColor);
  const encodedCountColor = encodeURIComponent(countColor);

  const badgeUrl = `https://api.visitorbadge.io/api/visitors?path=${encodedPath}&label=${encodedLabel}&labelColor=${encodedLabelColor}&countColor=${encodedCountColor}`;

  return (
    <a
      href="https://visitorbadge.io"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded",
        className
      )}
      title={`Live Visitor Count for ${targetUrl}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={badgeUrl}
        alt={`${label} Counter`}
        loading="lazy"
        decoding="async"
        className="h-5 w-auto rounded"
      />
    </a>
  );
}
