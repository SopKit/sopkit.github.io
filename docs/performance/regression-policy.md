# Performance Regression Policy

## Tolerance Limits
To balance rapid feature development with uncompromising speed:
- **Core Web Vitals (LCP, FCP, TBT)**: Maximum allowable regression is **+10%** from the verified baseline, provided it does not breach the category ceiling.
- **CLS (Layout Stability)**: Zero tolerance for any CLS > 0.05. Desktop must remain < 0.03.
- **Bundle Size**: Any pull request introducing more than **+25 KiB** of JavaScript to the shared entrypoint must be rejected. Feature code must be code-split into dynamic chunks.

## Baseline Management
- Baselines are committed in `scripts/performance/lighthouse-all.ts` as immutable snapshots.
- A baseline may only be updated when a major redesign improves metrics across all routes.
- Baselines may never be raised to conceal regressions.
