/**
 * @file src/seo/entities.ts
 * @description Internal entity relationships and Knowledge Graph modeling for SopKit (AEO/GEO).
 */

import { SITE_URL, GITHUB_REPO_URL } from "@/constants/config";

export interface SopKitEntity {
  id: string;
  name: string;
  type: "Platform" | "Category" | "Tool" | "Article";
  url: string;
  description: string;
  sameAs?: string[];
  parentEntityId?: string;
  childEntityIds?: string[];
}

export const PLATFORM_ENTITY: SopKitEntity = {
  id: "sopkit-platform",
  name: "SopKit",
  type: "Platform",
  url: SITE_URL,
  description: "High-performance privacy-first client-side web utility platform providing 600+ browser tools.",
  sameAs: [
    GITHUB_REPO_URL,
    "https://x.com/sopkit",
  ],
};

/**
 * Returns contextual entity metadata for a given category slug
 */
export function getCategoryEntity(slug: string, name: string): SopKitEntity {
  return {
    id: `category-${slug}`,
    name,
    type: "Category",
    url: `${SITE_URL}/${slug}`,
    description: `Complete collection of privacy-first online ${name} on SopKit.`,
    parentEntityId: PLATFORM_ENTITY.id,
  };
}
