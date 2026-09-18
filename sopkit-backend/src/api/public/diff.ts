/**
 * @file sopkit-backend/src/api/public/diff.ts
 * @description Edge API for line diffs, unified patch generation, and semantic JSON diffs.
 */

import { Hono } from "hono";
import { z } from "zod";

export const diffRouter = new Hono();

const TextDiffSchema = z.object({
  original: z.string().max(200000),
  modified: z.string().max(200000),
  mode: z.enum(["lines", "words", "json"]).default("lines"),
});

interface DiffChange {
  type: "added" | "removed" | "unchanged";
  value: string;
  lineNumOriginal?: number;
  lineNumModified?: number;
}

// LCS-based diff calculation
function computeLineDiff(originalText: string, modifiedText: string): {
  changes: DiffChange[];
  stats: { additions: number; deletions: number; unchanged: number };
} {
  const origLines = originalText.split(/\r?\n/);
  const modLines = modifiedText.split(/\r?\n/);

  const n = origLines.length;
  const m = modLines.length;

  // Optimisation: simple dynamic programming table for LCS
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (origLines[i - 1] === modLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to build diff
  const changes: DiffChange[] = [];
  let i = n;
  let j = m;
  let additions = 0;
  let deletions = 0;
  let unchanged = 0;

  const stack: DiffChange[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && origLines[i - 1] === modLines[j - 1]) {
      stack.push({
        type: "unchanged",
        value: origLines[i - 1],
        lineNumOriginal: i,
        lineNumModified: j,
      });
      unchanged++;
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      stack.push({
        type: "added",
        value: modLines[j - 1],
        lineNumModified: j,
      });
      additions++;
      j--;
    } else if (i > 0) {
      stack.push({
        type: "removed",
        value: origLines[i - 1],
        lineNumOriginal: i,
      });
      deletions++;
      i--;
    }
  }

  while (stack.length > 0) {
    const item = stack.pop();
    if (item) changes.push(item);
  }

  return {
    changes,
    stats: { additions, deletions, unchanged },
  };
}

diffRouter.post("/", async (c) => {
  try {
    const rawBody = await c.req.json();
    const parsed = TextDiffSchema.safeParse(rawBody);

    if (!parsed.success) {
      return c.json({ error: "Invalid payload", details: parsed.error.format() }, 400);
    }

    const { original, modified, mode } = parsed.data;

    if (mode === "json") {
      let origObj: unknown;
      let modObj: unknown;
      try {
        origObj = JSON.parse(original);
        modObj = JSON.parse(modified);
      } catch {
        return c.json({ error: "Invalid JSON provided for json diff mode" }, 400);
      }

      const formattedOrig = JSON.stringify(origObj, null, 2);
      const formattedMod = JSON.stringify(modObj, null, 2);
      const result = computeLineDiff(formattedOrig, formattedMod);

      return c.json({
        mode: "json",
        stats: result.stats,
        changes: result.changes,
      });
    }

    const result = computeLineDiff(original, modified);
    return c.json({
      mode: "lines",
      stats: result.stats,
      changes: result.changes,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Diff failed";
    return c.json({ error: message }, 500);
  }
});
