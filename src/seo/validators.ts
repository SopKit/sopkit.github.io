import { SITE_URL } from "@/constants/config";

export interface SeoValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateSeoMetadata(input: {
  title: string;
  description: string;
  canonical: string;
  h1Count?: number;
}): SeoValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Title checks
  if (!input.title || input.title.trim().length === 0) {
    errors.push("Title is missing or empty.");
  } else if (input.title.length > 70) {
    warnings.push(`Title length (${input.title.length}) exceeds recommended 60-70 characters.`);
  } else if (input.title.length < 20) {
    warnings.push(`Title length (${input.title.length}) is unusually short.`);
  }

  // Description checks
  if (!input.description || input.description.trim().length === 0) {
    errors.push("Description is missing or empty.");
  } else if (input.description.length > 170) {
    warnings.push(`Description length (${input.description.length}) exceeds recommended 160 characters.`);
  } else if (input.description.length < 80) {
    warnings.push(`Description length (${input.description.length}) is under 80 characters.`);
  }

  // Canonical checks
  if (!input.canonical || !input.canonical.startsWith(SITE_URL)) {
    errors.push(`Canonical URL "${input.canonical}" is invalid or does not match primary domain.`);
  }

  // H1 checks
  if (input.h1Count !== undefined) {
    if (input.h1Count === 0) {
      errors.push("Missing H1 heading on page.");
    } else if (input.h1Count > 1) {
      errors.push(`Multiple H1 headings detected (${input.h1Count}). Exactly one H1 allowed.`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
