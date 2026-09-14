# Tool Architecture & Runtime Platform

## Overview
SopKit provides a catalog of 600+ web utilities. Prior to this redesign, monolithic imports of client packages and indiscriminate JSON loading degraded initial page loads.

The new architecture decouples tool definitions, metadata querying, and execution runtimes.

```
src/features/tools/
├── types.ts                   # Authoritative ToolDefinition & ToolPerformanceSpec contracts
├── registry.ts                # Server-side fast lookup (getToolBySlug, getAllTools)
├── relationships.ts           # Centralized related tools and internal link engine
├── ui/                        # Reusable tool presentation primitives (ToolShell, ToolDropzone)
└── runtime/                   # Lazy execution adapters (WebAssembly, Web Worker, Client Canvas)
```

## Performance Contracts for Tools
Every tool declares its execution footprint:
- **`runtimeMode`**: `"client"` | `"server"` | `"hybrid"`
- **`processing`**: `"browser"` | `"worker"` | `"edge"` | `"server"`
- **`bundleClass`**: `"light"` | `"medium"` | `"heavy"`
- **`lazyLoad`**: Heavy engines (PDF-lib, PDF.js, docx, canvas filters) load strictly upon first user interaction (file drop or click).

## Client-Side Zero-Knowledge Privacy
- All file processing happens entirely in the browser memory sandbox.
- No file uploads are transmitted to backend servers.
- When processing finishes, Object URLs are revoked to prevent browser memory leaks.
