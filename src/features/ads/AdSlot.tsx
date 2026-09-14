"use client";

/**
 * @file src/features/ads/AdSlot.tsx
 * @description Zero-CLS Ad container.
 * Strictly respects route policy, pre-reserves space, and prevents layout shifts.
 */

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { isAdAllowedOnRoute } from "./policy";
import { AD_PLACEMENTS } from "./placements";

interface AdSlotProps {
  placementKey: keyof typeof AD_PLACEMENTS;
  className?: string;
}

export function AdSlot({ placementKey, className = "" }: AdSlotProps) {
  const pathname = usePathname() || "";
  const [mounted, setMounted] = useState(false);
  const placement = AD_PLACEMENTS[placementKey];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!placement) return null;

  // Never render ad markup if ads are globally disabled or disallowed on this route
  if (!mounted || !isAdAllowedOnRoute(pathname)) {
    return null;
  }

  return (
    <aside
      aria-label="Advertisement"
      className={`${placement.wrapperClasses} ${className}`}
      style={{
        minHeight: `${placement.height}px`,
        containIntrinsicSize: `${placement.width}px ${placement.height}px`,
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", height: `${placement.height}px` }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={placement.slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
