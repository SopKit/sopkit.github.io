/**
 * @file src/seo/config.ts
 * @description Centralized SEO configuration and branding defaults for SopKit.
 */

import { SeoConfig } from "./types";
import { SITE_URL, SITE_NAME, GITHUB_REPO_URL } from "@/constants/config";

export const SEO_CONFIG: SeoConfig = {
  siteUrl: SITE_URL,
  siteName: SITE_NAME,
  defaultTitle: `${SITE_NAME} — Free Online Developer & Productivity Tools`,
  titleTemplate: `%s | ${SITE_NAME}`,
  defaultDescription:
    "Explore 600+ free online developer tools, PDF utilities, image editors, and converters. 100% private, browser-based, with zero file uploads or logins.",
  defaultOgImage: "/og-image.png",
  twitterHandle: "@sopkit",
  organization: {
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [
      GITHUB_REPO_URL,
      "https://x.com/sopkit",
    ],
  },
};
