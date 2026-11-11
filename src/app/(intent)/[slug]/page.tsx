import { notFound } from "next/navigation";
import { getIntentBySlug, intentData } from "@/lib/intent-data";
import { getMonetizationDecision } from "@/data/monetization";
import { getAllTools, getToolById, type Tool } from "@/lib/tools";
import {
	categoryKeyForOpportunity,
	relatedToolsForOpportunity,
} from "@/lib/seo-opportunity-related";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import SeoOpportunityTool from "@/components/seo/SeoOpportunityTool";
import {
    getSeoOpportunityBySlug,
    seoOpportunities,
    type SeoOpportunity,
} from "@/data/seo-opportunities";

// This route serves exactly two kinds of page:
//   1. Standalone SEO opportunity pages from src/data/seo-opportunities.ts
//      (each one carries a distinct tool preset and its own prose).
//   2. The handful of intent landers in src/lib/intent-data.ts.
// Any other slug is a 404. The keyword-permutation alias pages that used to
// be generated here from tool extraSlugs were doorway pages and are gone;
// retired opportunity slugs are 301-redirected to their parent tool by
// src/seo/redirects/opportunities.json instead of being rendered.

function syntheticToolFromOpportunity(opportunity: SeoOpportunity): Tool {
    const parentTool = getToolById(opportunity.parentToolSlug);

    return {
        id: opportunity.slug,
        name: opportunity.h1,
        description: opportunity.intro,
        route: opportunity.route,
        category: categoryKeyForOpportunity(opportunity),
        categoryName: opportunity.category,
        categorySlug: categoryKeyForOpportunity(opportunity),
        seoTitle: opportunity.title,
        seoDescription: opportunity.metaDescription,
        features: opportunity.useCases,
        faqs: opportunity.faqs,
        howTo: {
            name: `How to use ${opportunity.h1}`,
            steps: opportunity.steps.map((text, index) => ({
                name: `Step ${index + 1}`,
                text,
            })),
        },
        article: `
## ${opportunity.h1}
${opportunity.intro}

## Why this page exists
${opportunity.intent}

## Parent tool
This page uses the same core workflow as ${parentTool?.name || "the related SopKit utility"}, with settings and guidance focused on "${opportunity.keyword}".
`,
    };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const opportunity = getSeoOpportunityBySlug(slug);

    if (opportunity?.standalone) {
        const canonicalUrl = `https://sopkit.space${opportunity.route}`;

        return {
            title: opportunity.title,
            description: opportunity.metaDescription,
            alternates: {
                canonical: canonicalUrl,
            },
            openGraph: {
                title: opportunity.title,
                description: opportunity.metaDescription,
                url: canonicalUrl,
                siteName: "SopKit",
                images: [{ url: "/og-image.jpg" }],
                type: "website",
            },
            twitter: {
                card: "summary_large_image",
                title: opportunity.title,
                description: opportunity.metaDescription,
                images: ["/og-image.jpg"],
            },
            robots: getMonetizationDecision({ slug }).indexable ? { index: true, follow: true } : { index: false, follow: false },
        };
    }

    const intent = getIntentBySlug(slug);
    if (!intent) return {};

    const parentTool = getToolById(intent.parentToolId);
    if (!parentTool) return {};

    const canonicalUrl = `https://sopkit.space/${slug}`;
    const brandedTitle = `${intent.title} | SopKit`;

    return {
        title: brandedTitle,
        description: intent.description,
        keywords: intent.keywords,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: brandedTitle,
            description: intent.description,
            url: canonicalUrl,
            siteName: "SopKit",
            images: [{ url: "/og-image.jpg" }],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: brandedTitle,
            description: intent.description,
            images: ["/og-image.jpg"],
        },
        robots: getMonetizationDecision({ slug }).indexable ? { index: true, follow: true } : { index: false, follow: false },
    };
}

export default async function IntentPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const opportunity = getSeoOpportunityBySlug(slug);

    if (opportunity?.standalone) {
        const tool = syntheticToolFromOpportunity(opportunity);
        const relatedTools = relatedToolsForOpportunity(opportunity);
        const breadcrumbs = [
            { name: opportunity.category, url: opportunity.categoryHub },
            { name: opportunity.h1, url: opportunity.route },
        ];

        return (
            <ToolLayout tool={tool} breadcrumbs={breadcrumbs} relatedTools={relatedTools}>
                <SeoOpportunityTool opportunity={opportunity} />
            </ToolLayout>
        );
    }

    const intent = getIntentBySlug(slug);
    if (!intent) {
        notFound();
    }

    const parentTool = getToolById(intent.parentToolId);
    if (!parentTool) {
        notFound();
    }

    // Build the enriched tool to pass to ToolLayout, overriding the route to point to the intent slug
    const customName = intent.title.split(" - ")[0];
    const enrichedTool = {
        ...parentTool,
        name: customName,
        description: intent.description,
        article: intent.article,
        faqs: intent.faqs,
        route: `/${slug}`,
    };

    return (
        <ToolLayout breadcrumbs={[]} tool={enrichedTool}>
            <IntentToolDispatcher toolId={parentTool.id} />
        </ToolLayout>
    );
}

export async function generateStaticParams() {
    const slugs = new Set<string>();

    // Canonical tool routes that already have explicit page.tsx files
    const canonicalSlugs = new Set<string>();
    const tools = getAllTools();
    tools.forEach((t) => {
        const clean = (t.route || t.id).replace(/^\//, "").replace(/\/$/, "");
        canonicalSlugs.add(clean);
    });

    // Standalone SEO opportunities (only those without explicit dedicated
    // pages). Non-standalone entries exist to enrich a real tool page via
    // ToolLayout and never get a route of their own here.
    seoOpportunities.forEach((opportunity) => {
        if (opportunity.standalone && opportunity.slug && !canonicalSlugs.has(opportunity.slug)) {
            slugs.add(opportunity.slug);
        }
    });

    // Intent landers
    Object.keys(intentData).forEach((slug) => {
        if (!canonicalSlugs.has(slug)) {
            slugs.add(slug);
        }
    });

    return Array.from(slugs).map((slug) => ({ slug }));
}
