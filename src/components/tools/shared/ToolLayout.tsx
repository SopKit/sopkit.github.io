import { Suspense } from "react";
import BreadcrumbsEnhanced, { type Breadcrumb } from "@/components/seo/BreadcrumbsEnhanced";
import { RelatedToolsServer } from "./RelatedToolsServer";
import { MANUAL_TOOL_CONTENT } from "@/data/generated-manual-content";
import { isCuratedContent } from "@/data/content-curation";
import SeoOpportunityContent from "@/components/seo/SeoOpportunityContent";
import StructuredData from "@/components/shared/StructuredData";
import DownloadDisclaimer from "@/components/shared/DownloadDisclaimer";
import { ToolFAQ, ToolFeatures, ToolSteps } from "./ToolSharedComponents";
import { getRelatedTools, type Tool } from "@/lib/tools";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SITE_CONFIG } from "@/constants/config";
import AdPlacement from "@/components/ads/AdPlacement";
import { getSeoOpportunityByRoute } from "@/data/seo-opportunities";
import { ToolToolbar } from "./ToolToolbar";
import { EmbedWidgetGiver } from "./EmbedWidgetGiver";
import { VisitorBadge } from "@/components/shared/VisitorBadge";
import { ProcessingBadge } from "@/components/shared/ProcessingBadge";
import { JumpToToolButton } from "./JumpToToolButton";
import {
	resolveToolArchetype,
	getArchetypeWorkspaceClass,
	resolveDataProcessing,
	type ToolArchetype,
} from "@/features/tools/archetypes";

// Renders a curated article only. There is deliberately no generated fallback:
// a page without distinct prose renders no article section at all.
function ToolArticle({
	content,
	title,
}: {
	content?: string;
	title?: string;
}) {
	const articleContent = content?.trim();
	if (!articleContent) return null;
	const lines = articleContent.replace(/\\n/g, "\n").trim().split("\n");
	// Group consecutive "- " lines into a single <ul>: rendering <li> elements
	// directly inside the <div> below produced invalid HTML (a list item with
	// no list parent) on every page whose manual article contains bullets.
	type ArticleBlock =
		| { kind: "heading"; text: string; key: number }
		| { kind: "list"; items: string[]; key: number }
		| { kind: "paragraph"; text: string; key: number };
	const blocks: ArticleBlock[] = [];
	let pendingList: string[] = [];
	const flushList = (key: number) => {
		if (pendingList.length > 0) {
			blocks.push({ kind: "list", items: pendingList, key });
			pendingList = [];
		}
	};
	lines.forEach((line, i) => {
		if (line.startsWith("## ") || line.startsWith("### ")) {
			flushList(i);
			blocks.push({ kind: "heading", text: line.replace(/^#{2,3}\s+/, ""), key: i });
		} else if (line.startsWith("- ")) {
			pendingList.push(line.replace(/^- \s*/, ""));
		} else if (line.trim() === "") {
			flushList(i);
		} else {
			flushList(i);
			blocks.push({ kind: "paragraph", text: line, key: i });
		}
	});
	flushList(lines.length);
	return (
		<section className="scroll-mt-16 space-y-4 pt-6 border-t border-border/60" aria-label="About this tool">
			<div className="flex flex-col gap-1">
				<h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
					About {title || "this Utility"}
				</h2>
				<p className="text-xs sm:text-sm text-muted-foreground">
					Direct explanation of technical functionality, format support, and workflows.
				</p>
			</div>
			<div className="space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
				{blocks.map((block) => {
					if (block.kind === "heading") {
						return (
							<h3
								key={block.key}
								className="text-sm sm:text-base font-semibold text-foreground tracking-tight pt-2"
							>
								{block.text}
							</h3>
						);
					}
					if (block.kind === "list") {
						return (
							<ul key={block.key} className="ml-5 list-disc space-y-1 text-muted-foreground">
								{block.items.map((item, j) => (
									<li key={j} className="text-muted-foreground">
										{item}
									</li>
								))}
							</ul>
						);
					}
					return (
						<p key={block.key} className="whitespace-pre-line">
							{block.text}
						</p>
					);
				})}
			</div>
		</section>
	);
}

export interface ToolLayoutProps {
	tool: Tool;
	children: React.ReactNode;
	breadcrumbs?: Breadcrumb[];
	relatedTools?: Tool[];
	archetype?: ToolArchetype;
	showHireMe?: boolean;
}

const ROUTE_H1_OVERRIDES: Record<string, string> = {
	"/image-tools": "Free Image Tools — Compress, Resize, Convert & Edit",
	"/image-compressor": "Free Image Compressor — Reduce JPG, PNG & WebP File Size",
	"/seo-tools": "Free SEO Tools — Audit, Analyze & Optimize Your Website",
	"/pdf-tools": "Free PDF Tools — Merge, Split, Compress & Edit",
	"/ai-image-generator": "Free AI Image Generator — Create Art from Text Prompts",
	"/calculator-tools": "Free Online Calculators — Math, Finance, Academic & Business",
};

export default function ToolLayout({
	tool,
	children,
	breadcrumbs,
	relatedTools = [],
	archetype: explicitArchetype,
	showHireMe = false,
}: ToolLayoutProps) {
	const opportunity = getSeoOpportunityByRoute(tool.route);
	const routeKey = tool.route.endsWith("/") ? tool.route.slice(0, -1) : tool.route;

	// Prose (article, features, steps, FAQs) is rendered only for pages whose
	// content passed the uniqueness audit; see src/data/content-curation.ts.
	// Standalone opportunity pages use their slug as the tool id, and an
	// opportunity can also share a route with a registry tool, so both ids
	// are checked.
	const hasCuratedContent =
		isCuratedContent(tool.id) || (opportunity ? isCuratedContent(opportunity.slug) : false);

	const enrichedTool: Tool = { ...tool };

	if (hasCuratedContent) {
		// Curated manual content is the source of truth for prose.
		const manual = MANUAL_TOOL_CONTENT[tool.id];
		if (manual) {
			if (!enrichedTool.article && manual.whatItIs) {
				enrichedTool.article = manual.whatItIs;
			}
			if ((!enrichedTool.features || enrichedTool.features.length === 0) && manual.features?.length) {
				enrichedTool.features = manual.features;
			}
			if ((!enrichedTool.howTo || !enrichedTool.howTo.steps || enrichedTool.howTo.steps.length === 0) && manual.howToUse?.steps?.length) {
				enrichedTool.howTo = manual.howToUse;
			}
			if (manual.faqs?.length) {
				enrichedTool.faqs = manual.faqs;
			}
		}
	} else {
		// Non-curated pages carry no prose at all, so neither the page body nor
		// the structured data can fall back to templated text.
		enrichedTool.article = undefined;
		enrichedTool.features = undefined;
		enrichedTool.howTo = undefined;
		enrichedTool.faqs = undefined;
	}

	// Semantic H1 and SEO opportunity resolution
	if (ROUTE_H1_OVERRIDES[routeKey]) {
		enrichedTool.name = ROUTE_H1_OVERRIDES[routeKey];
	} else if (opportunity) {
		enrichedTool.name = opportunity.h1;
		enrichedTool.description = opportunity.intro;
		if (hasCuratedContent) {
			enrichedTool.faqs = opportunity.faqs;
			enrichedTool.howTo = {
				name: `How to use ${opportunity.h1}`,
				steps: opportunity.steps.map((text, index) => ({
					name: `Step ${index + 1}`,
					text,
				})),
			};
		}
	}

	const isCompanyPage = tool.category === "company";
	const isHubPage = isCompanyPage || tool.category === "content" || tool.route.endsWith("-tools") || tool.route === "/calculators";

	// Filter contextual related tools: 4 to 6 items maximum
	const finalRelatedTools = isCompanyPage
		? []
		: relatedTools.length > 0
			? relatedTools.slice(0, 6)
			: getRelatedTools(tool, 6);

	const finalDescription = String(enrichedTool.description || "").replace(/\\n/g, "\n").trim();

	// Archetype and responsive width resolution
	const resolvedArchetype = explicitArchetype || resolveToolArchetype(enrichedTool);
	const workspaceClass = getArchetypeWorkspaceClass(resolvedArchetype);
	const dataProcessing = resolveDataProcessing(enrichedTool);
	const isDenseWorkspace = tool.id === "ai-image-generator";

	const curatedArticle = hasCuratedContent ? enrichedTool.article : undefined;
	const curatedFeatures = hasCuratedContent ? enrichedTool.features : undefined;
	const curatedSteps = hasCuratedContent ? enrichedTool.howTo?.steps : undefined;
	const curatedFaqs = hasCuratedContent ? enrichedTool.faqs : undefined;
	const curatedOpportunity = hasCuratedContent ? opportunity : undefined;
	const showsReference = Boolean(
		curatedArticle?.trim() ||
			curatedOpportunity ||
			curatedFeatures?.length ||
			curatedSteps?.length ||
			curatedFaqs?.length,
	);

	return (
		<div className="min-h-screen bg-background text-foreground relative">
			<StructuredData tool={enrichedTool} />

			{/* Top Breadcrumb Navigation */}
			<div className="container mx-auto px-4 pt-3 pb-1">
				<Suspense fallback={<div className="h-5 w-48 bg-muted/20 animate-pulse rounded" />}>
					<BreadcrumbsEnhanced
						customBreadcrumbs={breadcrumbs}
						suppressSchema={true}
					/>
				</Suspense>
			</div>

			<main id="main-content" className="container mx-auto px-4 pb-16 space-y-6">
				{/* Concise, Task-First Tool Header */}
				<header className="max-w-5xl mx-auto space-y-3 pt-1 text-left">
					<div className="flex min-w-0 items-start justify-between gap-3">
						<h1 className="min-w-0 font-sans text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
							{enrichedTool.name}
						</h1>
					</div>

					<p className="text-sm sm:text-[15px] text-muted-foreground leading-6 max-w-3xl">
						{finalDescription}
					</p>

					{/* Factual Processing Model & Category Badges */}
					{!isCompanyPage && (
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-b border-border/40 pb-3">
							<div className="flex min-w-0 flex-wrap items-center gap-2">
								<ProcessingBadge
									model={dataProcessing.type}
									info={dataProcessing}
									interactive={true}
								/>
								<span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted/40 text-[11px] font-mono text-muted-foreground border border-border/50">
									100% Free
								</span>
								{enrichedTool.category && (
									<span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted/40 text-[11px] font-mono text-muted-foreground capitalize border border-border/50">
										{enrichedTool.category.replace("-tools", "")}
									</span>
								)}
							</div>

							{/* Secondary Toolbar Actions */}
							{!isHubPage && (
								<ToolToolbar
									toolId={tool.id}
									toolRoute={tool.route}
									toolName={tool.name}
									category={enrichedTool.category}
								/>
							)}
						</div>
					)}
				</header>

				{/* Downloader Legal Notice if applicable */}
				{tool.category === "downloaders" && (
					<DownloadDisclaimer platformName={tool.name.replace(/ downloader$/i, "").replace(/ download$/i, "")} />
				)}

				{/* Primary Tool Workspace (Visually Dominant) */}
				{!isHubPage && (
					<section id="tool-workspace" aria-label={`${enrichedTool.name} workspace`} className={`w-full ${workspaceClass} mx-auto transition-all scroll-mt-24`}>
						<div className={`rounded-2xl border border-border/70 bg-card/60 shadow-xs overflow-hidden ${isDenseWorkspace ? "p-2.5 sm:p-3 lg:p-4" : "p-3 sm:p-5 lg:p-7"}`}>
							{children}
						</div>
					</section>
				)}

				{isHubPage && (
					<section id="tool-workspace" className="w-full max-w-6xl mx-auto scroll-mt-20">
						{children}
					</section>
				)}

				{/* Secondary Content & SEO Documentation (Subordinated to Tool) */}
				{!isCompanyPage && (
					<div className="w-full max-w-4xl mx-auto space-y-10 pt-6">
						{/* Workspace / documentation divider, only when curated prose follows */}
						{showsReference && (
							<div className="flex items-center justify-between border-b border-border/60 pb-2 text-xs font-mono text-muted-foreground">
								<span className="uppercase tracking-wider font-semibold">Technical Reference & FAQs</span>
								<a
									href="#tool-workspace"
									className="text-primary hover:underline font-medium inline-flex items-center gap-1"
								>
									↑ Return to Workspace
								</a>
							</div>
						)}

						<AdPlacement placement="after-tool" category={tool.category} slug={tool.id} />

						{/* Curated editorial documentation; each component returns null when its input is empty */}
						<ToolArticle content={curatedArticle} title={enrichedTool.name} />

						{curatedOpportunity && (
							<SeoOpportunityContent opportunity={curatedOpportunity} />
						)}

						<ToolFeatures features={curatedFeatures} toolName={enrichedTool.name} />

						<ToolSteps steps={curatedSteps} toolName={enrichedTool.name} />

						<ToolFAQ faqs={curatedFaqs} toolName={enrichedTool.name} />

						{/* Contextual Related Tools (Compact 4-6 list) */}
						{finalRelatedTools.length > 0 && (
							<RelatedToolsServer
								currentTool={tool.id}
								category={tool.category}
								tools={finalRelatedTools}
							/>
						)}

						{/* Compact Embed Option */}
						<EmbedWidgetGiver toolId={tool.id} toolName={tool.name} />

						{/* Community & Open-Source Footer Notice */}
						<footer className="pt-8 border-t border-border/40 text-center space-y-3">
							<p className="text-xs text-muted-foreground max-w-xl mx-auto leading-relaxed">
								SopKit is a privacy-focused utility platform with transparent processing and privacy choices.
							</p>
							<div className="flex flex-wrap items-center justify-center gap-3">
								<VisitorBadge path={tool.route || `/${tool.id}`} label="PAGE VIEWS" />
								<Button variant="outline" size="sm" asChild className="h-7 text-xs gap-1.5 rounded-lg">
									<a href={SITE_CONFIG.githubRepoUrl} target="_blank" rel="noreferrer">
										<Github className="h-3.5 w-3.5" />
										Contribute on GitHub
									</a>
								</Button>
								<Button variant="ghost" size="sm" asChild className="h-7 text-xs rounded-lg text-muted-foreground hover:text-foreground">
									<Link href="/privacy">Privacy Notice</Link>
								</Button>
								<Button variant="ghost" size="sm" asChild className="h-7 text-xs rounded-lg text-muted-foreground hover:text-foreground">
									<Link href="/terms">Terms of Service</Link>
								</Button>
							</div>
						</footer>
					</div>
				)}
				<JumpToToolButton />
			</main>
		</div>
	);
}
