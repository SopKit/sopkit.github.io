/**
 * @file src/seo/types.ts
 * @description Type definitions for SopKit SEO, Schema.org JSON-LD, and metadata generation.
 */

export interface SeoConfig {
  siteUrl: string;
  siteName: string;
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  defaultOgImage: string;
  twitterHandle: string;
  organization: {
    name: string;
    url: string;
    logo: string;
    sameAs: string[];
  };
}

export interface PageSeoInput {
  title: string;
  description: string;
  pathname: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  noindex?: boolean;
}

export interface BreadcrumbItem {
  name: string;
  item: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface HowToStep {
  name: string;
  text: string;
  url?: string;
  image?: string;
}

export interface SoftwareAppSchemaInput {
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem?: string;
  offers?: {
    price: string;
    priceCurrency: string;
  };
}
