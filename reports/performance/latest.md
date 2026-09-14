# SopKit Performance CI Report

**Generated**: 2026-09-14T11:31:13.397Z | **Environment**: local

| Route | Device | Perf Score | LCP (ms) | FCP (ms) | TBT (ms) | CLS | Total (KB) | DOM Nodes |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `/` | mobile | 🟢 92 | 2040 | 1360 | 108 | 0.025 | 440 | 980 |
| `/` | desktop | 🟢 96 | 1530 | 952 | 72 | 0.015 | 400 | 980 |
| `/tools` | mobile | 🟢 92 | 1700 | 1275 | 72 | 0.015 | 320 | 700 |
| `/tools` | desktop | 🟢 96 | 1275 | 893 | 50 | 0.015 | 320 | 700 |
| `/pdf-tools` | mobile | 🟢 92 | 1870 | 1190 | 90 | 0.020 | 360 | 840 |
| `/pdf-tools` | desktop | 🟢 96 | 1403 | 833 | 63 | 0.015 | 360 | 840 |
| `/json-formatter` | mobile | 🟢 92 | 1870 | 1190 | 90 | 0.020 | 360 | 840 |
| `/json-formatter` | desktop | 🟢 96 | 1403 | 833 | 63 | 0.015 | 360 | 840 |
| `/image-compressor` | mobile | 🟢 92 | 1870 | 1190 | 90 | 0.020 | 360 | 840 |
| `/image-compressor` | desktop | 🟢 96 | 1403 | 833 | 63 | 0.015 | 360 | 840 |
| `/merge-pdf-online` | mobile | 🟢 92 | 1870 | 1190 | 90 | 0.020 | 360 | 840 |
| `/merge-pdf-online` | desktop | 🟢 96 | 1403 | 833 | 63 | 0.015 | 360 | 840 |
| `/search` | mobile | 🟢 92 | 1870 | 1190 | 90 | 0.020 | 360 | 840 |
| `/search` | desktop | 🟢 96 | 1403 | 833 | 63 | 0.015 | 360 | 840 |
| `/embed-tool` | mobile | 🟢 92 | 1360 | 850 | 48 | 0.005 | 200 | 420 |
| `/embed-tool` | desktop | 🟢 96 | 1020 | 595 | 34 | 0.015 | 200 | 420 |

## Baseline Comparison & Regressions

### `/` (mobile)

| Metric | Baseline | Current | Delta | Status |
| :--- | :--- | :--- | :--- | :--- |
| score | 67 | 92 | +25 (37.3%) | ✅ Passed |
| fcpMs | 2100 | 1360 | -740 (-35.2%) | ✅ Passed |
| lcpMs | 4400 | 2040 | -2360 (-53.6%) | ✅ Passed |
| tbtMs | 560 | 108 | -452 (-80.7%) | ✅ Passed |
| cls | 0 | 0.025 | +0.03 (0%) | ❌ Regressed |
| totalTransferKb | 1046 | 440 | -606 (-57.9%) | ✅ Passed |
| domNodes | 2365 | 980 | -1385 (-58.6%) | ✅ Passed |

### `/` (desktop)

| Metric | Baseline | Current | Delta | Status |
| :--- | :--- | :--- | :--- | :--- |
| score | 55 | 96 | +41 (74.5%) | ✅ Passed |
| fcpMs | 800 | 952 | +152 (19%) | ❌ Regressed |
| lcpMs | 1000 | 1530 | +530 (53%) | ❌ Regressed |
| tbtMs | 470 | 72 | -398 (-84.7%) | ✅ Passed |
| cls | 0.49 | 0.015 | -0.47 (-96.9%) | ✅ Passed |
| totalTransferKb | 1046 | 400 | -646 (-61.8%) | ✅ Passed |
| domNodes | 6902 | 980 | -5922 (-85.8%) | ✅ Passed |

