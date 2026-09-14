"use client";

import Link from "next/link";
import { 
	Image as ImageIcon, 
	FileText, 
	Code, 
	Calculator, 
	Search, 
	Type, 
	ArrowRight, 
	Zap, 
	ShieldCheck, 
	Sparkles,
	SlidersHorizontal,
	Cpu
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CategoryPill {
	label: string;
	href: string;
}

interface BentoCategory {
	title: string;
	description: string;
	href: string;
	icon: React.ComponentType<{ className?: string }>;
	badge?: string;
	accentClass: string;
	iconBgClass: string;
	pills: CategoryPill[];
	colSpan: string; // e.g. "col-span-1 md:col-span-2"
	highlightMetric?: string;
	highlightFeature?: string;
}

const CATEGORIES: BentoCategory[] = [
	{
		title: "Image Suite",
		description: "Compress, resize, remove backgrounds, crop, and convert image formats locally at WebAssembly speeds with zero quality loss.",
		href: "/image-tools",
		icon: ImageIcon,
		badge: "Most Popular",
		accentClass: "from-sky-500/20 via-blue-500/10 to-transparent",
		iconBgClass: "bg-sky-500/10 text-sky-600 dark:text-sky-400 group-hover:bg-sky-600 group-hover:text-white dark:group-hover:bg-sky-500",
		colSpan: "lg:col-span-2",
		highlightMetric: "90% Size Reduction",
		highlightFeature: "WebAssembly Canvas Engine",
		pills: [
			{ label: "Image Compressor", href: "/image-compressor" },
			{ label: "Image Resizer", href: "/image-resizer" },
			{ label: "Background Remover", href: "/background-remover" },
			{ label: "Image to WebP", href: "/image-converter" },
			{ label: "Circular Crop", href: "/circular-image-crop" },
		],
	},
	{
		title: "PDF Engine",
		description: "Merge, split, compress, edit annotations, and encrypt PDF documents with 100% client-side privacy.",
		href: "/pdf-tools",
		icon: FileText,
		badge: "Zero Uploads",
		accentClass: "from-rose-500/20 via-red-500/10 to-transparent",
		iconBgClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 group-hover:bg-rose-600 group-hover:text-white dark:group-hover:bg-rose-500",
		colSpan: "lg:col-span-1",
		highlightMetric: "AES-256 Secure",
		highlightFeature: "In-Browser PDF.js Core",
		pills: [
			{ label: "PDF Merge", href: "/merge-pdf-online" },
			{ label: "Compress PDF", href: "/pdf-compressor" },
			{ label: "PDF Editor", href: "/pdf-editor" },
			{ label: "Image to PDF", href: "/image-to-pdf" },
		],
	},
	{
		title: "Developer Utilities",
		description: "JSON formatting, Base64 encoding, UUID generation, diff checking, minifiers, and regex debuggers for fast workflows.",
		href: "/developer-tools",
		icon: Code,
		badge: "Essential",
		accentClass: "from-violet-500/20 via-purple-500/10 to-transparent",
		iconBgClass: "bg-violet-500/10 text-violet-600 dark:text-violet-400 group-hover:bg-violet-600 group-hover:text-white dark:group-hover:bg-violet-500",
		colSpan: "lg:col-span-1",
		highlightMetric: "Sub-millisecond",
		highlightFeature: "Local Memory Sandboxing",
		pills: [
			{ label: "JSON Formatter", href: "/json-formatter" },
			{ label: "UUID Generator", href: "/uuid-generator" },
			{ label: "Base64 Encoder", href: "/base64-encode-decode" },
			{ label: "Diff Checker", href: "/text-diff-checker" },
		],
	},
	{
		title: "Calculators & Converters",
		description: "Precise financial retainers, CGPA converters, attendance tracking, EMI calculators, and unit converters.",
		href: "/calculators",
		icon: Calculator,
		accentClass: "from-amber-500/20 via-orange-500/10 to-transparent",
		iconBgClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-600 group-hover:text-white dark:group-hover:bg-amber-500",
		colSpan: "lg:col-span-1",
		pills: [
			{ label: "CGPA to Percentage", href: "/cgpa-to-percentage-calculator" },
			{ label: "Car Loan EMI", href: "/car-loan-calculator" },
			{ label: "Inflation Calculator", href: "/inflation-calculator" },
		],
	},
	{
		title: "SEO & Webmaster",
		description: "Inspect meta tags, audit website accessibility, generate robots.txt, and analyze search index signals.",
		href: "/seo-tools",
		icon: Search,
		accentClass: "from-emerald-500/20 via-teal-500/10 to-transparent",
		iconBgClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white dark:group-hover:bg-emerald-500",
		colSpan: "lg:col-span-1",
		pills: [
			{ label: "SEO Audit Tool", href: "/seo-audit-tool" },
			{ label: "Meta Tags", href: "/seo-tools" },
			{ label: "Robots Generator", href: "/seo-tools" },
		],
	},
	{
		title: "Text & Typography",
		description: "Live word & character counts, slug generators, markdown previews, case conversion, and text cleaning.",
		href: "/text-tools",
		icon: Type,
		accentClass: "from-indigo-500/20 via-blue-500/10 to-transparent",
		iconBgClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-500",
		colSpan: "lg:col-span-1",
		pills: [
			{ label: "Word Counter", href: "/word-counter" },
			{ label: "Markdown to HTML", href: "/markdown-to-html" },
			{ label: "Slug Generator", href: "/slug-generator" },
		],
	},
];

export function BentoCategoryGrid() {
	return (
		<section className="py-12 [content-visibility:auto] [contain-intrinsic-size:1px_600px] relative">
			{/* Header */}
			<div className="flex flex-col items-center text-center space-y-3 mb-10 max-w-2xl mx-auto">
				<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold select-none">
					<Sparkles className="h-3.5 w-3.5" />
					<span>Curated Tool Suites</span>
				</div>
				<h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground uppercase">
					Explore by Category
				</h2>
				<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
					Each category runs fully offline in your browser. Zero cloud dependencies, zero data leakage, and lightning-fast execution.
				</p>
			</div>

			{/* Bento Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
				{CATEGORIES.map((cat) => {
					const Icon = cat.icon;
					return (
						<div
							key={cat.title}
							className={`group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-card/60 dark:bg-card/40 border border-border/70 dark:border-border/40 backdrop-blur-xl hover:border-primary/50 dark:hover:border-primary/40 hover:shadow-[0_20px_50px_-12px_rgba(37,99,235,0.12)] transition-all duration-300 overflow-hidden ${cat.colSpan}`}
						>
							{/* Background Radial Glow */}
							<div
								className={`absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br ${cat.accentClass} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
							/>

							{/* Top Row: Icon + Title + Badge */}
							<div className="space-y-4 relative z-10">
								<div className="flex items-center justify-between gap-3">
									<div className="flex items-center gap-3">
										<div className={`p-3 rounded-xl transition-all duration-300 shadow-sm ${cat.iconBgClass}`}>
											<Icon className="h-5 w-5" />
										</div>
										<div>
											<Link
												href={cat.href}
												className="text-base sm:text-lg font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
											>
												<span>{cat.title}</span>
												<ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-primary" />
											</Link>
											{cat.highlightFeature && (
												<span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1 mt-0.5">
													<Cpu className="h-2.5 w-2.5 text-primary" />
													{cat.highlightFeature}
												</span>
											)}
										</div>
									</div>

									{cat.badge && (
										<Badge
											variant="outline"
											className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full border-primary/30 text-primary bg-primary/5 whitespace-nowrap"
										>
											{cat.badge}
										</Badge>
									)}
								</div>

								<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
									{cat.description}
								</p>
							</div>

							{/* Bottom Row: Quick Sub-Tool Pills & Action Link */}
							<div className="mt-6 pt-4 border-t border-border/40 relative z-10 flex flex-col gap-3">
								<div className="flex flex-wrap gap-1.5">
									{cat.pills.map((pill) => (
										<Link
											key={pill.label}
											href={pill.href}
											className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-muted/60 hover:bg-primary hover:text-primary-foreground text-muted-foreground border border-border/40 hover:border-transparent transition-all duration-200"
										>
											{pill.label}
										</Link>
									))}
								</div>

								<div className="flex items-center justify-between pt-1">
									{cat.highlightMetric ? (
										<span className="text-[11px] font-bold text-foreground/80 flex items-center gap-1">
											<Zap className="h-3 w-3 text-amber-500 fill-amber-500" />
											{cat.highlightMetric}
										</span>
									) : (
										<span className="text-[10px] text-muted-foreground flex items-center gap-1">
											<ShieldCheck className="h-3 w-3 text-emerald-500" />
											100% Private Sandbox
										</span>
									)}

									<Link
										href={cat.href}
										className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
									>
										<span>View Category</span>
										<ArrowRight className="h-3 w-3" />
									</Link>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}
