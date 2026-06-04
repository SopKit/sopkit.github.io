# SopKit Codebase Documentation

## Overview

[SopKit](https://sopkit.github.io) is a high-performance, developer-first utility ecosystem built with Next.js 16 (App Router) and Tailwind CSS v4. It provides **405+ free online tools** across 12 categories with a privacy-first, browser-based processing model. The platform is designed for maximum SEO visibility with structured data, dynamic sitemaps, AI-crawler-friendly indexing, and comprehensive internal linking.

## Core Architecture

### 1. Data Layer

- **tools.json** (`src/constants/tools.json`): Single source of truth for all 405+ tools. Contains metadata including SEO titles, descriptions, categories, extraSlugs, and popularity flags.
- **tools.ts** (`src/lib/tools.ts`): Type-safe utility functions to query and filter tools from JSON data.
- **config.ts** (`src/constants/config.ts`): Site-wide configuration including tool count, URLs, and contact info.

### 2. Routing System

- **App Router**: Tools organized into semantic category folders (`(image)`, `(pdf)`, `(video)`, etc.) for SEO-optimized URL structure.
- **Dynamic routes**: Category hub pages, tool pages, and SEO opportunity pages all use dynamic routing.
- **Intent routes** (`(intent)/[slug]`): Handles SEO opportunity pages and extra slug redirects.

### 3. SEO Infrastructure

- **Centralized SEO utility** (`src/lib/seo.ts`): Generates metadata, WebApplication/SoftwareApplication schema, FAQPage, HowTo, BreadcrumbList, and CollectionPage JSON-LD.
- **Dynamic sitemap** (`src/app/sitemap.ts`): Generates XML sitemap with prioritized URLs, tool pages, blog posts, and SEO opportunity pages.
- **Robots.txt** (`src/app/robots.ts`): Crawler-specific rules allowing all major search engines and AI crawlers.
- **Structured data**: JSON-LD injected on every tool page via shared components.
- **LLM index** (`public/llms.txt`): AI-search-friendly index of all tools and site structure.

### 4. Components

- **ToolLayout**: Shared wrapper providing consistent structure, SEO-rich content (FAQs, Features, Steps), and JSON-LD schemas.
- **ToolSEOLayout**: Full SEO wrapper with breadcrumbs, features, FAQs, author bio, structured data.
- **DownloaderEngine**: Interactive component for video and social media downloaders.
- **Shared components**: BreadcrumbsEnhanced, FAQSection, AuthorBio, ReviewSnippets, SocialEngagement, StructuredData.

## Developer Workflow

### Adding a New Tool

1. Append entry to `src/constants/tools.json` with name, description, route, category, keywords, and extraSlugs.
2. Create folder and `page.js` in `src/app/(category)/[slug]/`.
3. Export metadata object with title, description, and canonical URL.
4. The sitemap, robots.txt, and schema components handle the rest automatically.

### CRITICAL: Metadata Rules

- **Every `page.js` MUST export a `metadata` object** using `export const metadata = { ... }`.
- **No dynamic helpers**: All metadata must be hardcoded for maximum performance and SEO predictability.
- **Server Components only**: All `page.js` and `layout.js` files remain Server Components. Use client components for interactivity.
- **SEO title pattern**: `Free [Tool Name] Online - [Use Case] | SopKit`
- **Meta description pattern**: `Use [Primary Keyword] to [specific outcome]. Works in your browser, no signup, preview and download instantly.`

## Schema Types Per Page

- **Tool pages**: SoftwareApplication, FAQPage, HowTo, BreadcrumbList
- **Category hubs**: CollectionPage with ItemList
- **Homepage**: WebSite, Organization, FAQPage, BreadcrumbList
- **Blog**: Article, BreadcrumbList

## Related Skills

- **SEO Audit** (`/seo-audit`): Full SEO audit framework for identifying issues
- **SEO Content Writer**: SEO-optimized blog posts and landing pages
- **SEO/GEO**: Generative engine optimization for AI search visibility
