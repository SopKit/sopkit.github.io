# Routing Architecture

## Overview
SopKit uses Next.js App Router with consolidated route domains and clean URL taxonomy.

## Route Domain Structure
Instead of fragmenting tools into 20+ arbitrary filesystem route groups, routes are organized into functional domain layouts:
```
src/app/
├── (site)/                    # Public user-facing marketing, hub, and content routes
│   ├── page.tsx               # Homepage (/)
│   ├── tools/                 # Tool directory (/tools)
│   ├── categories/            # Category index (/categories)
│   ├── search/                # Search interface (/search)
│   ├── blog/                  # High-authority articles & guides (/blog)
│   └── developers/            # API documentation & SDKs (/developers)
├── (platform)/                # Core tool execution workspace
│   └── [slug]/                # Canonical tool route (/pdf-compressor, etc.)
├── api/                       # Zero-knowledge server endpoints & healthchecks
├── embed-tool/                # Lightweight ad-free embed frame for external sites
└── layout.tsx                 # Root layout with minimal global providers
```

## Canonical URL Invariants
- Public URLs remain strictly canonical: `https://sopkit.space/<tool-slug>`.
- No route groups appear in public URLs.
- Category taxonomy is managed by the server tool registry (`src/features/tools/registry.ts`), not by directory nesting.
- Embeddable versions are accessed via `/embed-tool?id=<tool-id>`.
