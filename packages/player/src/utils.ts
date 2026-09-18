/**
 * @file packages/player/src/utils.ts
 * @description Utility functions for time formatting, math, and DOM checks.
 */

/**
 * Formats time in seconds to human-readable format (MM:SS or HH:MM:SS).
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "00:00";

  const total = Math.floor(seconds);
  const hrs = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");

  if (hrs > 0) {
    return `${hrs}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}

/**
 * Clamps a number between min and max bounds.
 */
export function clamp(val: number, min = 0, max = 1): number {
  return Math.min(Math.max(val, min), max);
}

/**
 * Checks if Picture-in-Picture is supported in the current environment.
 */
export function isPipSupported(): boolean {
  return (
    typeof document !== "undefined" &&
    "pictureInPictureEnabled" in document &&
    Boolean(document.pictureInPictureEnabled)
  );
}

/**
 * Checks if Fullscreen API is supported in the current environment.
 */
export function isFullscreenSupported(): boolean {
  return (
    typeof document !== "undefined" &&
    Boolean(
      document.fullscreenEnabled ||
        (document as any).webkitFullscreenEnabled ||
        (document as any).mozFullScreenEnabled ||
        (document as any).msFullscreenEnabled
    )
  );
}
