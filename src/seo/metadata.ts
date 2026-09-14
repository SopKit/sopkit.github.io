/**
 * @file src/seo/metadata.ts
 * @description Centralized Next.js Metadata generator for pages and tools.
 */

import type { Metadata } from "next";
import { SEO_CONFIG } from "./config";
import { PageSeoInput } from "./types";
import { buildCanonicalUrl } from "./canonical";

export function buildPageMetadata(input: PageSeoInput): Metadata {
  const canonical = buildCanonicalUrl(input.pathname);
  const ogImage = input.ogImage || SEO_CONFIG.defaultOgImage;
  const ogImageUrl = ogImage.startsWith("http") ? ogImage : `${SEO_CONFIG.siteUrl}${ogImage}`;

  const title = input.title.includes(SEO_CONFIG.siteName)
    ? input.title
    : `${input.title} | ${SEO_CONFIG.siteName}`;

  return {
    title,
    description: input.description,
    keywords: input.keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description: input.description,
      url: canonical,
      siteName: SEO_CONFIG.siteName,
      locale: "en_US",
      type: input.ogType || "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: input.title,
        },
      ],
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
      ...(input.modifiedTime ? { modifiedTime: input.modifiedTime } : {}),
      ...(input.authors ? { authors: input.authors } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: input.description,
      creator: SEO_CONFIG.twitterHandle,
      images: [ogImageUrl],
    },
    robots: input.noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}
