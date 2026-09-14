# Route Performance Matrix

Every public route on SopKit resolves to a specific category performance profile.

| Route Pattern | Category | JS Budget | CSS Budget | Total Transfer | LCP Target | TBT Target | CLS Target | Allow Ads | Allow Analytics |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| `/` | Marketing | 220 KiB | 45 KiB | 550 KiB | < 2.4s | < 180ms | < 0.05 | ❌ | ✅ |
| `/tools` | Directory | 180 KiB | 35 KiB | 400 KiB | < 2.0s | < 120ms | < 0.03 | ❌ | ✅ |
| `/categories` | Directory | 180 KiB | 35 KiB | 400 KiB | < 2.0s | < 120ms | < 0.03 | ❌ | ✅ |
| `/search` | Directory | 180 KiB | 35 KiB | 400 KiB | < 2.0s | < 120ms | < 0.03 | ❌ | ✅ |
| `/pdf-tools` (Category Hub) | Tool | 200 KiB | 40 KiB | 450 KiB | < 2.2s | < 150ms | < 0.04 | ❌ | ✅ |
| `/*-pdf-*` (PDF Tools) | Tool | 200 KiB | 40 KiB | 450 KiB | < 2.2s | < 150ms | < 0.04 | ❌ | ✅ |
| `/*image*` (Image Tools) | Tool | 200 KiB | 40 KiB | 450 KiB | < 2.2s | < 150ms | < 0.04 | ❌ | ✅ |
| `/json-formatter` (Code Tools) | Tool | 190 KiB | 35 KiB | 420 KiB | < 2.0s | < 120ms | < 0.03 | ❌ | ✅ |
| `/blog/*` | Content | 190 KiB | 40 KiB | 580 KiB | < 2.4s | < 180ms | < 0.05 | ✅ | ✅ |
| `/docs/*` | Documentation | 160 KiB | 35 KiB | 380 KiB | < 2.0s | < 120ms | < 0.02 | ❌ | ✅ |
| `/developers/*` | Developer | 170 KiB | 35 KiB | 390 KiB | < 2.0s | < 120ms | < 0.02 | ❌ | ✅ |
| `/embed-tool` | Utility | 120 KiB | 25 KiB | 250 KiB | < 1.6s | < 80ms | < 0.01 | ❌ | ❌ |
