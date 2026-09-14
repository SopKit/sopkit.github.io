/**
 * @file sopkit-backend/src/validation/schemas.ts
 * @description Request validation schemas using Zod.
 */

import { z } from "zod";

export const SearchQuerySchema = z.object({
  q: z.string().min(1).max(100),
  limit: z.coerce.number().min(1).max(50).default(20),
  category: z.string().optional(),
});

export const VitalReportSchema = z.object({
  id: z.string(),
  name: z.enum(["CLS", "FCP", "FID", "INP", "LCP", "TTFB"]),
  value: z.number().nonnegative(),
  rating: z.enum(["good", "needs-improvement", "poor"]),
  route: z.string(),
  timestamp: z.number(),
});
