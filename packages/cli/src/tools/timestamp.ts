/**
 * @file packages/cli/src/tools/timestamp.ts
 * @description Unix timestamp and epoch date utilities for SopKit CLI.
 */

export interface TimestampInfo {
  seconds: number;
  milliseconds: number;
  iso: string;
  utc: string;
  local: string;
  relative: string;
}

export function now(): TimestampInfo {
  const d = new Date();
  return formatTimestamp(d);
}

export function fromEpoch(epoch: number | string): TimestampInfo {
  let num = typeof epoch === "string" ? Number(epoch.trim()) : epoch;
  if (isNaN(num)) {
    throw new Error(`Invalid numeric epoch timestamp: "${epoch}"`);
  }
  // Detect if seconds or milliseconds
  if (num < 1e11) {
    num = num * 1000;
  }
  return formatTimestamp(new Date(num));
}

export function fromDateString(str: string): TimestampInfo {
  const d = new Date(str.trim());
  if (isNaN(d.getTime())) {
    throw new Error(`Unable to parse date string: "${str}"`);
  }
  return formatTimestamp(d);
}

function formatTimestamp(d: Date): TimestampInfo {
  const ms = d.getTime();
  const sec = Math.floor(ms / 1000);
  return {
    seconds: sec,
    milliseconds: ms,
    iso: d.toISOString(),
    utc: d.toUTCString(),
    local: d.toString(),
    relative: getRelativeTime(ms),
  };
}

export function getRelativeTime(timestampMs: number): string {
  const nowMs = Date.now();
  const diffSec = Math.round((timestampMs - nowMs) / 1000);

  if (Math.abs(diffSec) < 5) return "just now";

  const isPast = diffSec < 0;
  const abs = Math.abs(diffSec);

  const units: [number, string][] = [
    [31536000, "year"],
    [2592000, "month"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
    [1, "second"],
  ];

  for (const [divisor, unit] of units) {
    if (abs >= divisor) {
      const val = Math.floor(abs / divisor);
      const plural = val > 1 ? `${unit}s` : unit;
      return isPast ? `${val} ${plural} ago` : `in ${val} ${plural}`;
    }
  }

  return "just now";
}
