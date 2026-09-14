/**
 * @file scripts/performance/report.ts
 * @description Generates latest.json and latest.md reports for performance CI.
 */

import fs from "fs";
import path from "path";
import { MetricComparison } from "./compare";

export interface PerformanceRunReport {
  timestamp: string;
  environment: string;
  results: Array<{
    route: string;
    device: "mobile" | "desktop";
    score: number;
    fcpMs: number;
    lcpMs: number;
    tbtMs: number;
    cls: number;
    jsTransferKb: number;
    cssTransferKb: number;
    totalTransferKb: number;
    domNodes: number;
    comparisons?: MetricComparison[];
  }>;
}

export function writePerformanceReport(report: PerformanceRunReport) {
  const reportsDir = path.resolve(process.cwd(), "reports/performance");
  fs.mkdirSync(reportsDir, { recursive: true });

  const jsonPath = path.join(reportsDir, "latest.json");
  const mdPath = path.join(reportsDir, "latest.md");

  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));

  let md = `# SopKit Performance CI Report\n\n`;
  md += `**Generated**: ${report.timestamp} | **Environment**: ${report.environment}\n\n`;
  md += `| Route | Device | Perf Score | LCP (ms) | FCP (ms) | TBT (ms) | CLS | Total (KB) | DOM Nodes |\n`;
  md += `| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n`;

  for (const r of report.results) {
    const scoreBadge = r.score >= 90 ? `🟢 ${r.score}` : r.score >= 75 ? `🟡 ${r.score}` : `🔴 ${r.score}`;
    md += `| \`${r.route}\` | ${r.device} | ${scoreBadge} | ${r.lcpMs} | ${r.fcpMs} | ${r.tbtMs} | ${r.cls.toFixed(3)} | ${r.totalTransferKb} | ${r.domNodes} |\n`;
  }

  md += `\n## Baseline Comparison & Regressions\n\n`;
  for (const r of report.results) {
    if (r.comparisons && r.comparisons.length > 0) {
      md += `### \`${r.route}\` (${r.device})\n\n`;
      md += `| Metric | Baseline | Current | Delta | Status |\n`;
      md += `| :--- | :--- | :--- | :--- | :--- |\n`;
      for (const c of r.comparisons) {
        const status = c.regressed ? "❌ Regressed" : "✅ Passed";
        md += `| ${c.metric} | ${c.baseline} | ${c.current} | ${c.delta > 0 ? `+${c.delta}` : c.delta} (${c.deltaPercent}%) | ${status} |\n`;
      }
      md += `\n`;
    }
  }

  fs.writeFileSync(mdPath, md);
  console.log(`Generated performance reports:\n- ${jsonPath}\n- ${mdPath}`);
}
