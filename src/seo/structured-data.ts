/**
 * @file src/seo/structured-data.ts
 * @description Generates standards-compliant Schema.org JSON-LD data for search engines & AI agents.
 */

import { SEO_CONFIG } from "./config";
import { BreadcrumbItem, FaqItem, HowToStep, SoftwareAppSchemaInput } from "./types";

/**
 * Global WebSite & Organization Schema
 */
export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SEO_CONFIG.siteUrl}/#website`,
        "url": SEO_CONFIG.siteUrl,
        "name": SEO_CONFIG.siteName,
        "description": SEO_CONFIG.defaultDescription,
        "publisher": {
          "@id": `${SEO_CONFIG.siteUrl}/#organization`,
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${SEO_CONFIG.siteUrl}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${SEO_CONFIG.siteUrl}/#organization`,
        "name": SEO_CONFIG.organization.name,
        "url": SEO_CONFIG.organization.url,
        "logo": {
          "@type": "ImageObject",
          "url": SEO_CONFIG.organization.logo,
        },
        "sameAs": SEO_CONFIG.organization.sameAs,
      },
    ],
  };
}

/**
 * SoftwareApplication Schema for individual tools
 */
export function buildSoftwareAppSchema(app: SoftwareAppSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": app.name,
    "description": app.description,
    "url": app.url,
    "applicationCategory": app.applicationCategory || "UtilityApplication",
    "operatingSystem": app.operatingSystem || "Web Browser (Any OS)",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "offers": {
      "@type": "Offer",
      "price": app.offers?.price ?? "0",
      "priceCurrency": app.offers?.priceCurrency ?? "USD",
    },
    "publisher": {
      "@type": "Organization",
      "name": SEO_CONFIG.organization.name,
      "url": SEO_CONFIG.organization.url,
    },
  };
}

/**
 * BreadcrumbList Schema
 */
export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.item,
    })),
  };
}

/**
 * FAQPage Schema
 */
export function buildFaqSchema(faqs: FaqItem[]) {
  if (!faqs || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };
}

/**
 * HowTo Schema
 */
export function buildHowToSchema(title: string, steps: HowToStep[]) {
  if (!steps || steps.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": title,
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      ...(step.url ? { url: step.url } : {}),
      ...(step.image ? { image: step.image } : {}),
    })),
  };
}
