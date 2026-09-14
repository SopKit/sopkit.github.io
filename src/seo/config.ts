/**
 * @file src/seo/config.ts
 * @description Centralized SEO configuration and branding defaults for SopKit.
 */

import { SeoConfig } from "./types";

export const SEO_CONFIG: SeoConfig = {
  siteUrl: "https://sopkit.github.io",
  siteName: "SopKit",
  defaultTitle: "SopKit — Free Online Developer & Productivity Tools",
  titleTemplate: "%s | SopKit",
  defaultDescription:
    "Explore 600+ free online developer tools, PDF utilities, image editors, and converters. 100% private, browser-based, with zero file uploads or logins.",
  defaultOgImage: "/og-image.png",
  twitterHandle: "@sopkit",
  organization: {
    name: "SopKit",
    url: "https://sopkit.github.io",
    logo: "https://sopkit.github.io/logo.png",
    sameAs: [
      "https://github.com/SopKit/sopkit.github.io",
      "https://x.com/sopkit",
    ],
  },
};
