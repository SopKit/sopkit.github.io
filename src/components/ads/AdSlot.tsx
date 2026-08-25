"use client";

import { useEffect, useRef, useState } from "react";

interface AdSlotProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical" | "autorelaxed";
  layout?: string;
  layoutKey?: string;
  className?: string;
  label?: boolean;
}

// Publisher account (ca-pub-1828915420581549). Hardcoded by request — no env vars.
const ADSENSE_CLIENT = "ca-pub-1828915420581549";

export default function AdSlot({
  slot,
  format = "auto",
  layout,
  layoutKey,
  className = "",
  label = true,
}: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const [unfilled, setUnfilled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Reserve exact vertical space based on ad format to eliminate Cumulative Layout Shift (CLS)
  const getReservedHeight = () => {
    switch (format) {
      case "autorelaxed":
        return 300;
      case "rectangle":
        return 260;
      case "horizontal":
        return 90;
      case "vertical":
        return 600;
      case "auto":
      default:
        return 160;
    }
  };

  const reservedHeight = getReservedHeight();

  // IntersectionObserver: Only request and load the ad when within 300px of the viewport
  // This drastically increases Google AdSense Viewability Rate (70-90%+), multiplying RPM and bidding competition.
  useEffect(() => {
    if (!slot || typeof window === "undefined") return;

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "300px 0px", // Pre-fetch slightly before the user scrolls into view
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [slot]);

  // Once visible in the viewport threshold, execute adsbygoogle push
  useEffect(() => {
    if (!isVisible || !slot || pushed.current) return;
    pushed.current = true;

    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense queue error", e);
    }

    // Unfilled status check to collapse empty space if no inventory was served
    const timer = setTimeout(() => {
      if (insRef.current?.getAttribute("data-ad-status") === "unfilled") {
        setUnfilled(true);
      }
    }, 4500);

    return () => clearTimeout(timer);
  }, [isVisible, slot]);

  if (!slot || unfilled) return null;

  return (
    <div
      ref={containerRef}
      className={`relative w-full my-6 flex flex-col items-center justify-center overflow-hidden rounded-xl border border-border/25 bg-muted/10 backdrop-blur-xs transition-all duration-300 ${className}`}
      style={{ minHeight: `${reservedHeight}px` }}
    >
      {label && (
        <div className="w-full flex items-center justify-between px-3 py-1 bg-muted/20 border-b border-border/15 text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest select-none">
          <span>Advertisement</span>
          <span className="text-[8px] opacity-60">Google Ad</span>
        </div>
      )}
      <div className="w-full flex items-center justify-center p-2">
        <ins
          ref={insRef}
          className="adsbygoogle w-full block text-center"
          style={{ display: "block", minHeight: `${reservedHeight - 24}px` }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
          data-ad-format={format}
          {...(layout ? { "data-ad-layout": layout } : {})}
          {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
          {...(format !== "autorelaxed" ? { "data-full-width-responsive": "true" } : {})}
        />
      </div>
    </div>
  );
}
