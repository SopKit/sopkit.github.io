import { PremiumHero } from "@/components/landing/PremiumHero";
import { HomeSEOContent } from "@/components/landing/HomeSEOContent";
import { HomeFAQ } from "@/components/landing/HomeFAQ";
import { getAllTools } from "@/lib/tools";
import Link from "next/link";
import StructuredData from "@/components/shared/StructuredData";
import { SITE_CONFIG } from "@/constants/config";
import AdPlacement from "@/components/ads/AdPlacement";
import { Badge } from "@/components/ui/badge";
import { ToolDirectory } from "@/components/landing/ToolDirectory";
import {
	Image as ImageIcon,
	FileText,
	Code,
	Calculator,
	Search,
	Type,
	ChevronRight,
	Zap,
	ArrowRight
} from "lucide-react";

import { generateMetadata as baseGenerateMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<any> {
	return baseGenerateMetadata({
		title: "SopKit - Private, Fast, Client-Side Free Online Tools (No Signup)",
		description: `${SITE_CONFIG.toolCountString} free online tools for Image, PDF, Video, Audio, and SEO that run 100% client-side in your browser. Private, fast, and secure — no uploads, no data selling, no signup required.`,
		path: "/",
	});
}

function ToolCard({ tool }: { tool: any }) {
	if (!tool) return null;
	return (
		<Link
			href={tool.route}
			className="group flex flex-col justify-between p-6 bg-card border border-border/60 rounded-none hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(255,255,255,0.05)] hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 no-underline h-full relative overflow-hidden"
		>
			<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
			<div className="relative z-10">
				<div className="flex items-start justify-between gap-2 mb-3">
					<h3 className="text-lg font-bold text-card-foreground tracking-tight group-hover:text-primary transition-colors">
						{tool.name}
					</h3>
					{tool.id === "ai-music-generator" && (
						<Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-[10px] px-1.5 py-0 shrink-0 animate-pulse rounded-none">
							<Zap className="h-2.5 w-2.5 mr-0.5" />
							Free This Week
						</Badge>
					)}
				</div>
				{tool.description && (
					<p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
						{tool.description}
					</p>
				)}
			</div>
			<div className="mt-6 text-primary text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all relative z-10">
				Open Tool <ChevronRight className="h-3.5 w-3.5" />
			</div>
		</Link>
	);
}

export default async function LandingPage() {
	const heroTitle = `Private, Fast & Secure — ${SITE_CONFIG.toolCountString} Free Tools That Run in Your Browser`;
	const heroSubtitle = "While other tool sites upload and sell your data, SopKit processes everything client-side on your own device. No uploads, no tracking your files, no signup — just fast, free tools.";
	const allTools = getAllTools();

	// 8 Featured tools (highly popular)
	const featuredToolIds = [
		"image-compressor",
		"merge-pdf-online",
		"resume-ats-score-checker",
		"ai-image-generator",
		"ssc-photo-signature-resizer",
		"gst-calculator",
		"tiktok-downloader",
		"text-to-speech"
	];
	const featuredTools = featuredToolIds.map(id => allTools.find(t => t.id === id)).filter(Boolean);

	// Popular for Indian Forms
	const indianFormToolIds = [
	        "ssc-photo-resizer",
	        "upsc-photo-resizer",
	        "neet-photo-resizer",
	        "pan-card-photo-resizer",
	        "signature-resizer-under-20kb"
	];
	const indianFormTools = indianFormToolIds.map(id => allTools.find(t => t.id === id)).filter(Boolean);

	// Developer Tools
	const developerToolIds = [
		"json-formatter",
		"base64-tool",
		"css-minifier",
		"uuid-generator"
	];
	const developerTools = developerToolIds.map(id => allTools.find(t => t.id === id)).filter(Boolean);

	// PDF Tools
	const pdfToolIds = [
		"compress-pdf-to-exact-kb",
		"pdf-editor",
		"merge-pdf-online",
		"pdf-compressor-under-200kb"
	];
	const pdfTools = pdfToolIds.map(id => allTools.find(t => t.id === id)).filter(Boolean);

	// 6 Categories Grid data
	const categoriesShow = [
		{ name: "Image Tools", href: "/image-tools", icon: <ImageIcon className="h-6 w-6" />, description: "Compress, resize, convert, edit and crop images locally in your browser." },
		{ name: "PDF Tools", href: "/pdf-tools", icon: <FileText className="h-6 w-6" />, description: "Merge, split, compress, edit and password protect PDF documents." },
		{ name: "Developer Tools", href: "/developer-tools", icon: <Code className="h-6 w-6" />, description: "JSON formatting, Base64 encoding, UUID generation, and minifiers." },
		{ name: "Calculators", href: "/calculators", icon: <Calculator className="h-6 w-6" />, description: "Convert CGPA, calculate attendance shortage, and manage loan calculations." },
		{ name: "SEO Tools", href: "/seo-tools", icon: <Search className="h-6 w-6" />, description: "Audit websites, inspect meta tags, generate robots.txt, and check cache." },
		{ name: "Text Tools", href: "/text-tools", icon: <Type className="h-6 w-6" />, description: "Word counters, text formatting, and legacy Devanagari Unicode converters." }
	];

	return (
		<main className="bg-background min-h-screen relative overflow-hidden">
			<StructuredData isHome={true} />
			{/* Global Decorative Gradients */}
			<div className="absolute top-0 left-0 w-full h-[1000px] bg-gradient-cute opacity-20 -z-10" />

			<div className="container mx-auto px-4 max-w-7xl">
				{/* Hero Section */}
				<PremiumHero title={heroTitle} subtitle={heroSubtitle} />

				<div className="py-8 max-w-4xl mx-auto">
					<AdPlacement placement="after-hero" pageType="home" />
				</div>

				{/* 6 Categories Grid */}
				<section className="py-12 [content-visibility:auto] [contain-intrinsic-size:1px_500px]">
					<h2 className="text-3xl font-black tracking-tight text-foreground mb-8 text-center uppercase">
						Browse by Category
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
						{categoriesShow.map((cat) => (
							<Link
								key={cat.name}
								href={cat.href}
								className="group p-6 bg-card border border-border/50 rounded-xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 no-underline"
							>
								<div className="flex items-center gap-3 mb-3">
									<div className="p-2.5 bg-secondary text-foreground rounded-lg">
										{cat.icon}
									</div>
									<h3 className="text-lg font-bold group-hover:text-primary transition-colors">
										{cat.name}
									</h3>
								</div>
								<p className="text-xs text-muted-foreground leading-relaxed">
									{cat.description}
								</p>
							</Link>
						))}
					</div>
				</section>

				{/* 560+ Live Tool Directory Search & Index Grid */}
				<ToolDirectory tools={allTools} />

				{/* Ad-Free Embed Feature Highlight */}
				<section className="py-12 border-t border-border/40 [content-visibility:auto] [contain-intrinsic-size:1px_300px]">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-card border border-border/50 p-6 md:p-10 rounded-2xl shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300">
						<div className="space-y-4">
							<Badge className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold px-3 py-1 rounded-full w-fit">
								New Feature
							</Badge>
							<h2 className="text-2xl font-black tracking-tight text-foreground uppercase">
								Seamless Tool Embeds
							</h2>
							<p className="text-xs text-muted-foreground leading-relaxed">
								Integrate any of SopKit's {SITE_CONFIG.toolCountString} utilities directly onto your own website, blog, or documentation. Our embedded sandboxes run entirely in your visitor's browser, consuming zero server bandwidth and remaining free to use.
							</p>
						</div>
						<div className="p-5 bg-muted/40 border border-border/40 rounded-xl space-y-3 font-mono text-xs text-muted-foreground">
							<span className="font-bold text-foreground block">HTML Embed Code Example:</span>
							<textarea
								readOnly
								value={`<iframe src="https://sopkit.github.io/embed-tool/?id=pdf-editor" width="100%" height="550" style="border:0; border-radius:12px; overflow:hidden;" title="Free Local PDF Editor by SopKit"></iframe>`}
								className="w-full h-20 p-2.5 bg-card border border-border/40 rounded-lg resize-none focus:outline-none text-[10px]"
							/>
						</div>
					</div>
				</section>

				{/* Final CTA - View All Tools */}
				<section className="py-16 text-center border-t border-border/40 [content-visibility:auto] [contain-intrinsic-size:1px_300px]">
					<div className="max-w-3xl mx-auto px-6 py-12 rounded-2xl bg-zinc-900 dark:bg-zinc-100 border border-zinc-800 dark:border-zinc-200 text-zinc-100 dark:text-zinc-900 relative overflow-hidden group shadow-sm">
						<h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-zinc-50 dark:text-zinc-950">Need another tool?</h2>
						<p className="text-sm text-zinc-300 dark:text-zinc-600 mb-8 max-w-lg mx-auto leading-relaxed">
							We have {SITE_CONFIG.toolCountString} free browser-based tools for document editing, image compression, formatting, calculations, and content generation.
						</p>
						<Link 
							href="/tools" 
							className="inline-flex h-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-200 dark:hover:bg-zinc-800 px-8 text-sm font-bold transition-all hover:scale-[1.01] active:scale-[0.99] gap-1.5"
						>
							View All {SITE_CONFIG.toolCountString} Tools
							<ArrowRight className="h-4 w-4" />
						</Link>
					</div>
				</section>

				{/* High-Value SEO Content Section */}
				<div className="py-12 max-w-4xl mx-auto [content-visibility:auto] [contain-intrinsic-size:1px_800px]">
					<AdPlacement placement="in-content" pageType="home" />
				</div>
				<div className="[content-visibility:auto] [contain-intrinsic-size:1px_1000px]">
					<HomeSEOContent />
				</div>

				{/* Conversational SEO (FAQs) */}
				<div className="[content-visibility:auto] [contain-intrinsic-size:1px_600px]">
					<HomeFAQ />
				</div>
			</div>
		</main>
	);
}
