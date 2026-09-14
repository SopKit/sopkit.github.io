# Analytics Architecture & Governance

## Overview
SopKit provides privacy-conscious analytics powered by Google Analytics 4 with Google Consent Mode v2 and zero PII transmission.

```
src/features/analytics/
├── types.ts                   # Strongly typed event taxonomy (page_view, tool_used, vital_metric)
├── consent.ts                 # Consent Mode v2 manager (default denial)
├── client.ts                  # Centralized client dispatcher with duplicate suppression
└── index.ts                   # Public analytics API
```

## Guiding Invariants
1. **Zero Content Transmission**: File contents, file names, input texts, passwords, or personal documents are never passed into analytics events. Events only log high-level metadata (e.g. `tool_id: "pdf-compressor"`, `file_type: "application/pdf"`, `size_bytes: 1420000`).
2. **Duplicate Suppression**: Client-side single-page transitions are de-duplicated so that re-renders or tab switches do not trigger duplicate `page_view` events.
3. **Consent Mode v2**: Tracking pixels remain idle until explicit user acceptance is recorded in `localStorage`.
4. **Non-Blocking Telemetry**: Web Vitals RUM beacons use `navigator.sendBeacon` to transmit metrics asynchronously without consuming main-thread execution cycles.
