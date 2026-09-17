# SopKit Performance CI Report

**Generated**: 2026-09-17T19:08:14.856Z | **Environment**: local

| Route | Device | Perf Score | LCP (ms) | FCP (ms) | TBT (ms) | CLS | Total (KB) | DOM Nodes |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `/` | mobile | 🟢 96 | 1560 | 1040 | 81 | 0.013 | 385 | 840 |
| `/` | desktop | 🟢 99 | 1170 | 728 | 54 | 0.007 | 350 | 840 |
| `/tools` | mobile | 🟢 96 | 1300 | 975 | 54 | 0.007 | 280 | 600 |
| `/tools` | desktop | 🟢 99 | 975 | 683 | 38 | 0.007 | 280 | 600 |
| `/pdf-tools` | mobile | 🟢 96 | 1430 | 910 | 68 | 0.010 | 315 | 720 |
| `/pdf-tools` | desktop | 🟢 99 | 1073 | 637 | 47 | 0.007 | 315 | 720 |
| `/json-formatter` | mobile | 🟢 96 | 1430 | 910 | 68 | 0.010 | 315 | 720 |
| `/json-formatter` | desktop | 🟢 99 | 1073 | 637 | 47 | 0.007 | 315 | 720 |
| `/image-compressor` | mobile | 🟢 96 | 1430 | 910 | 68 | 0.010 | 315 | 720 |
| `/image-compressor` | desktop | 🟢 99 | 1073 | 637 | 47 | 0.007 | 315 | 720 |
| `/merge-pdf-online` | mobile | 🟢 96 | 1430 | 910 | 68 | 0.010 | 315 | 720 |
| `/merge-pdf-online` | desktop | 🟢 99 | 1073 | 637 | 47 | 0.007 | 315 | 720 |
| `/search` | mobile | 🟢 96 | 1430 | 910 | 68 | 0.010 | 315 | 720 |
| `/search` | desktop | 🟢 99 | 1073 | 637 | 47 | 0.007 | 315 | 720 |
| `/embed-tool` | mobile | 🟢 96 | 1040 | 650 | 36 | 0.003 | 175 | 360 |
| `/embed-tool` | desktop | 🟢 99 | 780 | 455 | 25 | 0.007 | 175 | 360 |

## Baseline Comparison & Regressions

### `/` (mobile)

| Metric | Baseline | Current | Delta | Status |
| :--- | :--- | :--- | :--- | :--- |
| score | 67 | 96 | +29 (43.3%) | ✅ Passed |
| fcpMs | 2100 | 1040 | -1060 (-50.5%) | ✅ Passed |
| lcpMs | 4400 | 1560 | -2840 (-64.5%) | ✅ Passed |
| tbtMs | 560 | 81 | -479 (-85.5%) | ✅ Passed |
| cls | 0 | 0.013 | +0.01 (0%) | ❌ Regressed |
| totalTransferKb | 1046 | 385 | -661 (-63.2%) | ✅ Passed |
| domNodes | 2365 | 840 | -1525 (-64.5%) | ✅ Passed |

### `/` (desktop)

| Metric | Baseline | Current | Delta | Status |
| :--- | :--- | :--- | :--- | :--- |
| score | 55 | 99 | +44 (80%) | ✅ Passed |
| fcpMs | 800 | 728 | -72 (-9%) | ✅ Passed |
| lcpMs | 1000 | 1170 | +170 (17%) | ❌ Regressed |
| tbtMs | 470 | 54 | -416 (-88.5%) | ✅ Passed |
| cls | 0.49 | 0.007 | -0.48 (-98.6%) | ✅ Passed |
| totalTransferKb | 1046 | 350 | -696 (-66.5%) | ✅ Passed |
| domNodes | 6902 | 840 | -6062 (-87.8%) | ✅ Passed |

