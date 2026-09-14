/**
 * @file scripts/performance/compare.ts
 * @description Compares audit metrics against baseline and reports regressions.
 */

export interface MetricComparison {
  metric: string;
  baseline: number;
  current: number;
  delta: number;
  deltaPercent: number;
  regressed: boolean;
  threshold: number;
}

export function compareMetrics(
  baseline: Record<string, number>,
  current: Record<string, number>,
  thresholds: Record<string, number> = {}
): MetricComparison[] {
  const comparisons: MetricComparison[] = [];

  for (const [key, currentVal] of Object.entries(current)) {
    const baseVal = baseline[key];
    if (baseVal === undefined) continue;

    const delta = currentVal - baseVal;
    const deltaPercent = baseVal === 0 ? 0 : (delta / baseVal) * 100;
    const threshold = thresholds[key] || 0.1; // Default 10% tolerance

    // For performance metrics, higher value is usually worse (LCP, FCP, TBT, CLS, payload)
    // For scores (0-100), lower value is worse
    const isScore = key.toLowerCase().includes("score");
    const regressed = isScore
      ? currentVal < baseVal * (1 - threshold)
      : currentVal > baseVal * (1 + threshold);

    comparisons.push({
      metric: key,
      baseline: baseVal,
      current: currentVal,
      delta: Number(delta.toFixed(2)),
      deltaPercent: Number(deltaPercent.toFixed(1)),
      regressed,
      threshold,
    });
  }

  return comparisons;
}
