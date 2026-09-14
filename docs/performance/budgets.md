# Performance Budgets

SopKit enforces strict performance budgets across both mobile and desktop profiles.

## Engineering Targets

### Mobile Targets
- **FCP**: < 1.8s (Strict < 1.4s)
- **LCP**: < 2.5s (Strict < 2.2s)
- **TBT**: < 200ms (Strict < 150ms)
- **CLS**: < 0.1 (Strict < 0.05)
- **INP**: < 200ms
- **Speed Index**: < 3.0s
- **Total Transfer**: < 500–600 KiB
- **Initial JavaScript**: < 200–250 KiB compressed

### Desktop Targets
- **FCP**: < 1.2s (Strict < 0.8s)
- **LCP**: < 2.0s (Strict < 1.4s)
- **TBT**: < 150ms (Strict < 100ms)
- **CLS**: < 0.1 (Strict < 0.03)
- **Total Transfer**: < 450–500 KiB
- **Initial JavaScript**: < 200 KiB compressed

---

## Category Preset Budgets (Mobile)

| Category | Tier | JS (KiB) | CSS (KiB) | Total (KiB) | LCP (ms) | TBT (ms) | CLS | Max DOM | Max Clients |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Marketing** | Strict | 220 | 45 | 550 | 2400 | 180 | 0.05 | 1400 | 4 |
| **Tool** | Ultra-Strict | 200 | 40 | 450 | 2200 | 150 | 0.04 | 1200 | 6 |
| **Directory** | Strict | 180 | 35 | 400 | 2000 | 120 | 0.03 | 1000 | 3 |
| **Content** | Moderate | 190 | 40 | 580 | 2400 | 180 | 0.05 | 1200 | 2 |
| **Documentation** | Strict | 160 | 35 | 380 | 2000 | 120 | 0.02 | 1100 | 2 |
| **Developer** | Strict | 170 | 35 | 390 | 2000 | 120 | 0.02 | 1000 | 2 |
| **Utility (Embeds)**| Ultra-Strict | 120 | 25 | 250 | 1600 | 80 | 0.01 | 600 | 3 |
