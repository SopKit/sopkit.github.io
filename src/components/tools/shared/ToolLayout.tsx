import { Suspense } from "react";
import BreadcrumbsEnhanced, { type Breadcrumb } from "@/components/seo/BreadcrumbsEnhanced";
import { RelatedTools } from "@/components/seo/SocialEngagement";
import SeoOpportunityContent from "@/components/seo/SeoOpportunityContent";
import StructuredData from "@/components/shared/StructuredData";
import DownloadDisclaimer from "@/components/shared/DownloadDisclaimer";
import { ToolFAQ, ToolFeatures, ToolSteps } from "./ToolSharedComponents";
import { getRelatedTools, type Tool } from "@/lib/tools";
import { MANUAL_TOOL_CONTENT } from "@/data/generated-manual-content";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SITE_CONFIG } from "@/constants/config";
import AdPlacement from "@/components/ads/AdPlacement";
import { getSeoOpportunityByRoute } from "@/data/seo-opportunities";
import { ToolToolbar } from "./ToolToolbar";
import { EmbedWidgetGiver } from "./EmbedWidgetGiver";
import { VisitorBadge } from "@/components/shared/VisitorBadge";
import {
	resolveToolArchetype,
	getArchetypeWorkspaceClass,
	resolveDataProcessing,
	type ToolArchetype,
} from "@/features/tools/archetypes";

function ToolArticle({ content, title }: { content?: string; title?: string }) {
	if (!content) return null;

	const lines = content.replace(/\\n/g, "\n").trim().split("\n");
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
				{lines.map((line, i) => {
					if (line.startsWith("## ") || line.startsWith("### ")) {
						const headingText = line.replace(/^#{2,3}\s+/, "");
						return (
							<h3
								key={i}
								className="text-sm sm:text-base font-semibold text-foreground tracking-tight pt-2"
							>
								{headingText}
							</h3>
						);
					}
					if (line.startsWith("- ")) {
						return (
							<li key={i} className="ml-5 list-disc text-muted-foreground">
								{line.replace(/^- \s*/, "")}
							</li>
						);
					}
					if (line.trim() === "") return null;
					return (
						<p key={i} className="whitespace-pre-line">
							{line}
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

	const enrichedTool: Tool = { ...tool };
	const manualContent = MANUAL_TOOL_CONTENT[tool.id];

	if (manualContent) {
		enrichedTool.article = manualContent.whatItIs;
		enrichedTool.features = manualContent.features;
		enrichedTool.howTo = manualContent.howToUse;
		enrichedTool.faqs = (manualContent.faqs && manualContent.faqs.length > 0 && !manualContent.faqs[0]?.question?.startsWith("What exactly does"))
			? manualContent.faqs
			: (tool.faqs && tool.faqs.length > 0 ? tool.faqs : manualContent.faqs);
		enrichedTool.description = manualContent.seoDescription || enrichedTool.description;
	}

	// Semantic H1 resolution
	if (ROUTE_H1_OVERRIDES[routeKey]) {
		enrichedTool.name = ROUTE_H1_OVERRIDES[routeKey];
	} else if (opportunity) {
		enrichedTool.name = opportunity.h1;
		enrichedTool.description = opportunity.intro;
		enrichedTool.faqs = opportunity.faqs;
		enrichedTool.howTo = {
			name: `How to use ${opportunity.h1}`,
			steps: opportunity.steps.map((text, index) => ({
				name: `Step ${index + 1}`,
				text,
			})),
		};
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

			<main className="container mx-auto px-4 pb-16 space-y-6">
				{/* Concise, Task-First Tool Header */}
				<header className="max-w-4xl mx-auto space-y-2.5 pt-1 text-center sm:text-left">
					<div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
						<h1 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
							{enrichedTool.name}
						</h1>
					</div>

					<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
						{finalDescription}
					</p>

					{/* Factual Processing Model & Category Badges */}
					{!isCompanyPage && (
						<div className="flex flex-wrap items-center justify-center sm:justify-between gap-3 pt-1 border-b border-border/40 pb-3">
							<div className="flex flex-wrap items-center gap-2">
								<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-muted/50 border border-border/60 text-[11px] font-mono font-medium text-foreground/80">
									<span className={`h-1.5 w-1.5 rounded-full ${dataProcessing.type === "LOCAL" ? "bg-emerald-500" : dataProcessing.type === "NO_FILE_UPLOAD" ? "bg-blue-500" : "bg-purple-500"}`} />
									{dataProcessing.badgeText}
								</span>
								<span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted/30 text-[11px] font-mono text-muted-foreground">
									100% Free
								</span>
								{enrichedTool.category && (
									<span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted/30 text-[11px] font-mono text-muted-foreground capitalize">
										{enrichedTool.category}
									</span>
								)}
							</div>

							{/* Secondary Toolbar Actions */}
							{!isHubPage && (
								<ToolToolbar toolId={tool.id} toolRoute={tool.route} toolName={tool.name} />
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
					<section className={`w-full ${workspaceClass} mx-auto transition-all`}>
						<div className="rounded-2xl border border-border/70 bg-card/60 shadow-xs overflow-hidden p-4 sm:p-6 lg:p-8">
							{children}
						</div>
					</section>
				)}

				{isHubPage && (
					<section className="w-full max-w-6xl mx-auto">
						{children}
					</section>
				)}

				{/* Secondary Content & SEO Documentation (Subordinated to Tool) */}
				{!isCompanyPage && (
					<div className="w-full max-w-4xl mx-auto space-y-10 pt-6">
						<AdPlacement placement="after-tool" category={tool.category} slug={tool.id} />

						{/* Editorial Documentation Layout */}
						<ToolArticle content={enrichedTool.article} title={enrichedTool.name} />

						{opportunity && (
							<SeoOpportunityContent opportunity={opportunity} />
						)}

						<ToolFeatures features={enrichedTool.features} toolName={enrichedTool.name} />

						<ToolSteps
							steps={enrichedTool.howTo?.steps}
							toolName={enrichedTool.name}
						/>

						<ToolFAQ faqs={enrichedTool.faqs} toolName={enrichedTool.name} />

						{/* Contextual Related Tools (Compact 4-6 list) */}
						{finalRelatedTools.length > 0 && (
							<RelatedTools
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
								SopKit is a privacy-first utility platform. Free forever with zero tracking.
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
			</main>
		</div>
	);
}
