import { notFound, permanentRedirect } from "next/navigation";
import { getIntentBySlug, intentData } from "@/lib/intent-data";
import { getAllTools, getToolById, getToolByExtraSlug, type Tool } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import SeoOpportunityTool from "@/components/seo/SeoOpportunityTool";
import { MANUAL_TOOL_CONTENT } from "@/data/generated-manual-content";
import type { ManualToolContent } from "@/data/tool-manual-content";
import {
    getSeoOpportunityBySlug,
    seoOpportunities,
    type SeoOpportunity,
} from "@/data/seo-opportunities";

function categoryKeyForOpportunity(opportunity: SeoOpportunity) {
    if (opportunity.category === "Exam Image Tools") return "exam-tools";
    if (opportunity.category === "Student Calculators") return "calculators";
    if (opportunity.category === "API Key Testers") return "developer";
    if (opportunity.category === "SEO Tools") return "seo";
    return "utilities";
}

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

function relatedToolsForOpportunity(opportunity: SeoOpportunity) {
    const tools = getAllTools();
    const relatedRoutes = new Set([
        opportunity.parentToolRoute,
        ...opportunity.relatedSlugs.map((slug) => `/${slug}`),
    ]);

    return tools
        .filter((tool) => relatedRoutes.has(tool.route) || opportunity.relatedSlugs.includes(tool.id))
        .slice(0, 12);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const opportunity = getSeoOpportunityBySlug(slug);

    if (opportunity?.standalone) {
        const canonicalUrl = `https://sopkit.github.io${opportunity.route}/`;

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
            robots: { index: true, follow: true },
        };
    }

    const intent = getIntentBySlug(slug);

    if (!intent) {
        const extraTool = getToolByExtraSlug(slug) || getToolById(slug);
        if (extraTool) {
            const isNoUpload = slug.includes("no-upload") || slug.includes("offline") || slug.includes("local");
            const isPrivacy = slug.includes("privacy") || slug.includes("secure") || slug.includes("safe") || slug.includes("no-data-selling");
            const isFree = slug.includes("free") || slug.includes("no-signup") || slug.includes("no-registration");

            let title = "";
            let description = "";

            if (isNoUpload) {
                title = `Free ${extraTool.name} (No File Uploads) — Local Browser Tool`;
                description = `Run ${extraTool.name} locally in your browser. 100% private, client-side processing with zero file uploads. Fast, secure, and free.`;
            } else if (isPrivacy) {
                title = `Secure ${extraTool.name} — Privacy-Friendly Client-Side App`;
                description = `A secure, privacy-first alternative for ${extraTool.name}. Operates in a local browser sandbox with no server uploads and no data tracking.`;
            } else if (isFree) {
                title = `Free ${extraTool.name} Online — No Signup Required`;
                description = `Access our 100% free ${extraTool.name} online with no usage limits and no registration. Secure client-side processing in your browser.`;
            } else {
                title = `Free ${extraTool.name} Online — ${extraTool.description.slice(0, 30)}`;
                description = `Privacy-friendly, 100% client-side ${extraTool.name} online. Secure local browser processing with no file uploads and no data selling.`;
            }

            // Pad or trim description to exactly 150-160 characters
            const targetMin = 150;
            const targetMax = 160;
            if (description.length < targetMin) {
                while (description.length < targetMin) {
                    description += " Try it now for free.";
                }
            }
            if (description.length > targetMax) {
                description = description.substring(0, 157) + "...";
            }

            const canonicalUrl = `https://sopkit.github.io/${slug}/`;

            return {
                title,
                description,
                alternates: {
                    canonical: canonicalUrl,
                },
                openGraph: {
                    title,
                    description,
                    url: canonicalUrl,
                    siteName: "SopKit",
                    images: [{ url: "/og-image.jpg" }],
                    type: "website",
                },
                twitter: {
                    card: "summary_large_image",
                    title,
                    description,
                    images: ["/og-image.jpg"],
                },
                robots: { index: true, follow: true },
            };
        }
        return {};
    }

    const parentTool = getToolById(intent.parentToolId);
    if (!parentTool) return {};

    const canonicalUrl = `https://sopkit.github.io/${slug}/`;
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
        robots: { index: true, follow: true },
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

    // Serve long-tail extraSlugs as standalone landers instead of redirecting
    if (!intent) {
        const extraTool = getToolByExtraSlug(slug) || getToolById(slug);
        if (extraTool) {
            const isNoUpload = slug.includes("no-upload") || slug.includes("offline") || slug.includes("local");
            const isPrivacy = slug.includes("privacy") || slug.includes("secure") || slug.includes("safe") || slug.includes("no-data-selling");
            const isFree = slug.includes("free") || slug.includes("no-signup") || slug.includes("no-registration");

            const tool = { ...extraTool };
            const manualContent: ManualToolContent = MANUAL_TOOL_CONTENT[extraTool.id] || {} as ManualToolContent;

            // 1. Customize name (H1)
            let keywordHighlight = "";
            if (isNoUpload) {
                keywordHighlight = " (No File Uploads)";
            } else if (isPrivacy) {
                keywordHighlight = " (100% Secure & Private)";
            } else if (isFree) {
                keywordHighlight = " (Free & No Signup)";
            }
            tool.name = `${extraTool.name}${keywordHighlight}`;

            // 2. Customize description
            tool.description = `A specialized, privacy-focused version of our ${extraTool.name} utility optimized for client-side security and local execution.`;

            // 3. Customize Article
            let extraArticle = "";
            if (isNoUpload) {
                extraArticle = `
\n### Why a "No Upload" ${extraTool.name} is Essential
Many online converters require you to upload files to their servers, exposing your sensitive documents, financial statements, or personal images to data breach risks and employee access. This page provides a 100% client-side alternative. Your files never leave your device, meaning you get absolute security and zero network upload latency.
`;
            } else if (isPrivacy) {
                extraArticle = `
\n### Absolute Privacy and Data Security
With our privacy-friendly architecture, we guarantee that no data processed by this ${extraTool.name} is stored, tracked, or used to train artificial intelligence models. This local sandbox is built to meet corporate security guidelines and protect user confidentiality.
`;
            } else if (isFree) {
                extraArticle = `
\n### 100% Free Without Limitations
Unlike freemium services that restrict file sizes or impose hourly conversion limits, this ${extraTool.name} is free forever with no daily caps, no hidden fees, and no signups required. Access full processing capabilities instantly.
`;
            }
            const baseArticle = manualContent.whatItIs || extraTool.article || "";
            tool.article = baseArticle + extraArticle;

            // 4. Customize FAQs
            const baseFaqs = manualContent.faqs || extraTool.faqs || [];
            const customFaqs = [
                {
                    question: `Does this ${extraTool.name} page upload my files?`,
                    answer: `No, this page runs entirely in your browser. All operations are performed client-side using JavaScript, ensuring your files never leave your device.`
                },
                {
                    question: `Is there any fee or usage limit for this local tool?`,
                    answer: `No, the tool is 100% free with no registration, no file size limits, and no daily usage caps.`
                }
            ];
            tool.faqs = [...customFaqs, ...baseFaqs.slice(0, 3)];

            const breadcrumbs = [
                { name: "Home", url: "/" },
                { name: extraTool.name, url: extraTool.route },
                { name: slug.replace(/-/g, " "), url: `/${slug}` }
            ];

            return (
                <ToolLayout breadcrumbs={breadcrumbs} tool={tool}>
                    <IntentToolDispatcher toolId={extraTool.id} />
                </ToolLayout>
            );
        }
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
    seoOpportunities.forEach((opportunity) => {
        if (opportunity.slug) {
            slugs.add(opportunity.slug);
        }
    });
    Object.keys(intentData).forEach((slug) => {
        slugs.add(slug);
    });
    const tools = getAllTools();
    tools.forEach((t) => {
        if (t.extraSlugs) {
            t.extraSlugs.forEach((slug) => {
                const trimmed = slug ? slug.trim() : "";
                if (trimmed) {
                    slugs.add(trimmed);
                }
            });
        }
    });
    // Include tool routes so tools without dedicated pages are pre-rendered
    tools.forEach(t => {
        if (t.route) slugs.add(t.route.replace(/^\//, ''));
    });
    return Array.from(slugs).map((slug) => ({ slug }));
}
