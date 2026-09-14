# Lighthouse CI & Automated Auditing

## Pipeline Overview
Lighthouse audits run on every pull request and release build. The pipeline tests representative routes across both Mobile (Moto G Power simulation) and Desktop tiers.

### CI Scripts
- `npx tsx scripts/performance/discover-routes.ts`: Dynamically inventories all 618+ tools and canonical paths.
- `npx tsx scripts/performance/lighthouse-all.ts`: Audits representative route matrix against mobile/desktop budgets.
- `npx tsx scripts/performance/compare.ts`: Checks deltas against the September 14, 2026 baseline.
- `reports/performance/latest.json` & `latest.md`: Artifacts generated on every test pass.

### Execution Gating
A pull request will be blocked if any of the following occur:
1. Mobile LCP exceeds 2.5 seconds on any representative route.
2. Mobile CLS exceeds 0.10.
3. Mobile TBT exceeds 200 milliseconds.
4. Total uncompressed JavaScript on the homepage exceeds 250 KiB.
5. Critical third-party payload spikes above allocated quota.
