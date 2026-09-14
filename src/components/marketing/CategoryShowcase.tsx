"use client";

import Link from "next/link";
import { 
	Image as ImageIcon, 
	FileText, 
	Code, 
	Calculator, 
	Search, 
	Type, 
	ArrowUpRight 
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

const CATEGORIES = [
	{
		title: "Image Suite",
		description: "Compress, resize, remove backgrounds, crop, and convert image formats at WebAssembly speeds.",
		href: "/image-tools",
		count: "50+ Tools",
		icon: ImageIcon,
	},
	{
		title: "PDF Engine",
		description: "Merge, split, compress, annotate, and password protect documents with zero server uploads.",
		href: "/pdf-tools",
		count: "40+ Tools",
		icon: FileText,
	},
	{
		title: "Developer Utilities",
		description: "JSON formatting, Base64 encoding, UUID generation, diff checking, minifiers, and regex parsers.",
		href: "/developer-tools",
		count: "100+ Tools",
		icon: Code,
	},
	{
		title: "Calculators",
		description: "CGPA converters, financial retainers, car loan EMIs, inflation tracking, and unit calculations.",
		href: "/calculators",
		count: "80+ Tools",
		icon: Calculator,
	},
	{
		title: "SEO & Webmaster",
		description: "Inspect meta tags, audit website accessibility, generate robots.txt, and analyze indexing signals.",
		href: "/seo-tools",
		count: "45+ Tools",
		icon: Search,
	},
	{
		title: "Text & Content",
		description: "Live word & character counts, slug generators, markdown converters, case converters, and text diffs.",
		href: "/text-tools",
		count: "60+ Tools",
		icon: Type,
	},
];

export function CategoryShowcase() {
	return (
		<Section id="categories" spacing="default">
			<Container size="xl">
				{/* Section Header */}
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
					<div className="space-y-3 max-w-xl">
						<span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
							Curated Suites
						</span>
						<h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-foreground leading-[1.12]">
							Find Your Perfect <span className="italic">Utility</span>
						</h2>
						<p className="font-sans text-sm sm:text-base text-muted-foreground leading-relaxed">
							Explore specialized suites designed for specific workflows. Every tool runs 100% locally in your browser sandbox.
						</p>
					</div>

					<Link
						href="/tools"
						className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground hover:text-accent transition-colors no-underline group"
					>
						<span>View all categories</span>
						<ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
					</Link>
				</div>

				{/* 6 Clean Editorial Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{CATEGORIES.map((cat) => {
						const Icon = cat.icon;
						return (
							<Link
								key={cat.title}
								href={cat.href}
								className="group relative flex flex-col justify-between p-7 rounded-2xl bg-card border border-border/80 hover:border-foreground/40 shadow-sm hover:shadow-md transition-all duration-200 no-underline"
							>
								<div>
									<div className="flex items-center justify-between mb-5">
										<div className="p-3 rounded-xl bg-surface-muted text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
											<Icon className="h-5 w-5" />
										</div>
										<span className="text-xs font-mono text-muted-foreground bg-surface-muted px-2.5 py-1 rounded-full">
											{cat.count}
										</span>
									</div>

									<h3 className="font-sans text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
										{cat.title}
									</h3>
									<p className="font-sans text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
										{cat.description}
									</p>
								</div>

								<div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
									<span>Explore tools</span>
									<ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
								</div>
							</Link>
						);
					})}
				</div>
			</Container>
		</Section>
	);
}
