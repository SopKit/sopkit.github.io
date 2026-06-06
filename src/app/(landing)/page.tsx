import { PremiumHero } from "@/components/landing/PremiumHero";
import { HomeSEOContent } from "@/components/landing/HomeSEOContent";
import { HomeFAQ } from "@/components/landing/HomeFAQ";
import { getAllTools } from "@/lib/tools";
import Link from "next/link";
import { STATIC_ROUTES } from "@/lib/tools";
import StructuredData from "@/components/shared/StructuredData";
import { SITE_CONFIG } from "@/constants/config";
import AdPlacement from "@/components/ads/AdPlacement";
import { Badge } from "@/components/ui/badge";
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
		title: "SopKit - The Premium Free Online Toolkit (No Signup)",
		description: `Access ${SITE_CONFIG.toolCountString} pro-grade online tools for Image, PDF, Video, Audio, and SEO. Secure, private, and 100% free with no registration required.`,
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
	const heroTitle = "A Comprehensive Toolkit for Your Digital Life.";
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
		"ssc-photo-signature-resizer",
		"upsc-photo-resizer",
		"neet-photo-signature-resizer",
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
				<PremiumHero title={heroTitle} />

				<div className="py-8 max-w-4xl mx-auto">
					<AdPlacement placement="after-hero" pageType="home" />
				</div>

				{/* 6 Categories Grid */}
				<section className="py-12">
					<h2 className="text-3xl font-black tracking-tight text-foreground mb-8 text-center uppercase">
						Browse by Category
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
						{categoriesShow.map((cat) => (
							<Link
								key={cat.name}
								href={cat.href}
								className="group p-8 bg-card border border-border/60 rounded-none hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_20px_50px_rgba(255,255,255,0.03)] hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 no-underline"
							>
								<div className="flex items-center gap-4 mb-4">
									<div className="p-3 bg-primary/10 text-primary rounded-none">
										{cat.icon}
									</div>
									<h3 className="text-xl font-bold group-hover:text-primary transition-colors">
										{cat.name}
									</h3>
								</div>
								<p className="text-sm text-muted-foreground leading-relaxed">
									{cat.description}
								</p>
							</Link>
						))}
					</div>
				</section>

				{/* 8 Featured Tools */}
				<section className="py-12 border-t border-border/40">
					<h2 className="text-3xl font-black tracking-tight text-foreground mb-8 uppercase">
						Featured Tools
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
						{featuredTools.map((tool: any) => (
							<ToolCard key={tool.id} tool={tool} />
						))}
					</div>
				</section>

				{/* Popular for Indian Forms */}
				<section className="py-12 border-t border-border/40">
					<h2 className="text-3xl font-black tracking-tight text-foreground mb-2 uppercase">
						Popular for Indian Forms
					</h2>
					<p className="text-muted-foreground mb-8">
						Quick tools to resize and compress photos, signatures, and PDFs for UPSC, SSC, NEET, JEE, and PAN Card portals.
					</p>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
						{indianFormTools.map((tool: any) => (
							<ToolCard key={tool.id} tool={tool} />
						))}
					</div>
				</section>

				{/* Developer Tools */}
				<section className="py-12 border-t border-border/40">
					<h2 className="text-3xl font-black tracking-tight text-foreground mb-2 uppercase">
						Developer Tools
					</h2>
					<p className="text-muted-foreground mb-8">
						Format code, encode Base64 strings, generate cryptographically secure UUIDs, and optimize stylesheets.
					</p>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
						{developerTools.map((tool: any) => (
							<ToolCard key={tool.id} tool={tool} />
						))}
					</div>
				</section>

				{/* PDF Tools */}
				<section className="py-12 border-t border-border/40">
					<h2 className="text-3xl font-black tracking-tight text-foreground mb-2 uppercase">
						PDF Tools
					</h2>
					<p className="text-muted-foreground mb-8">
						Compress PDFs to exact limits, split pages, merge files, and format PDFs for public government uploads.
					</p>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
						{pdfTools.map((tool: any) => (
							<ToolCard key={tool.id} tool={tool} />
						))}
					</div>
				</section>

				{/* Final CTA - View All Tools */}
				<section className="py-16 text-center border-t border-border/40">
					<div className="max-w-3xl mx-auto px-6 py-16 rounded-none bg-foreground text-background relative overflow-hidden group">
						<div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity" />
						<h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-background">Need another tool?</h2>
						<p className="text-lg opacity-80 mb-10 text-background/90">
							We have {SITE_CONFIG.toolCountString} free browser-based tools for document editing, image compression, formatting, calculations, and content generation.
						</p>
						<Link 
							href="/tools" 
							className="inline-flex h-14 items-center justify-center rounded-none bg-background text-foreground px-10 text-lg font-bold hover:bg-background/95 transition-transform border border-transparent gap-2 hover:gap-3 group/btn"
						>
							View All {SITE_CONFIG.toolCountString} Tools
							<ArrowRight className="h-5 w-5 transition-transform" />
						</Link>
					</div>
				</section>

				{/* High-Value SEO Content Section */}
				<div className="py-12 max-w-4xl mx-auto">
					<AdPlacement placement="in-content" pageType="home" />
				</div>
				<HomeSEOContent />

				{/* Conversational SEO (FAQs) */}
				<HomeFAQ />
			</div>
		</main>
	);
}
