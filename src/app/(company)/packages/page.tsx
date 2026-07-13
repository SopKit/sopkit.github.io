"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, Copy, Check } from "lucide-react";
import { AppleNavbar } from "@/components/navigation/AppleNavbar";
import { AppleFooter } from "@/components/footers/AppleFooter";
import { GridPattern } from "@/components/shared/GridPattern";
import { getAllCategories } from "@/lib/tools";

const PACKAGES_DATA = [
	{
		id: "cli",
		name: "@sopkit/cli",
		description: "An interactive, prompt-driven terminal interface to use all SopKit developer utilities directly from your command-line.",
		npmLink: "https://www.npmjs.com/package/@sopkit/cli",
		githubLink: "https://github.com/SopKit/sopkit.github.io/tree/main/packages/cli",
		installCmd: "npx @sopkit/cli",
		badge: "CLI Utility",
	},
	{
		id: "base64",
		name: "@sopkit/base64",
		description: "High-performance, URL-safe Base64 encoding & decoding supporting full Unicode and UTF-8 characters.",
		npmLink: "https://www.npmjs.com/package/@sopkit/base64",
		githubLink: "https://github.com/SopKit/sopkit.github.io/tree/main/packages/base64",
		installCmd: "npm install @sopkit/base64",
		toolLink: "/base64-encode",
		badge: "Encoding",
	},
	{
		id: "uuid",
		name: "@sopkit/uuid",
		description: "Cryptographically secure UUID v4 (random) and v1 (timestamp) generation and validation library.",
		npmLink: "https://www.npmjs.com/package/@sopkit/uuid",
		githubLink: "https://github.com/SopKit/sopkit.github.io/tree/main/packages/uuid",
		installCmd: "npm install @sopkit/uuid",
		toolLink: "/uuid-generator",
		badge: "Security & ID",
	},
	{
		id: "slug",
		name: "@sopkit/slug",
		description: "Accent-normalized, multilingual URL slug generator built for SEO-friendly routing and clean slugs.",
		npmLink: "https://www.npmjs.com/package/@sopkit/slug",
		githubLink: "https://github.com/SopKit/sopkit.github.io/tree/main/packages/slug",
		installCmd: "npm install @sopkit/slug",
		toolLink: "/slug-generator",
		badge: "SEO / Text",
	},
];

export default function PackagesPage() {
	const [copiedId, setCopiedId] = useState<string | null>(null);

	const handleCopy = async (id: string, text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopiedId(id);
			setTimeout(() => setCopiedId(null), 2000);
		} catch (err) {
			console.error("Copy failed", err);
		}
	};

	const categories = getAllCategories().map(cat => ({ 
		label: cat.name, 
		href: cat.slug.startsWith("/") ? cat.slug : `/${cat.slug}` 
	}));

	return (
		<div className="min-h-screen bg-background flex flex-col font-sans">
			<AppleNavbar />
			<main className="flex-1 relative">
				<GridPattern className="opacity-[0.03]" />

				{/* Minimalist Hero */}
				<section className="container mx-auto max-w-5xl px-6 pt-16 pb-12 text-center space-y-4">
					<span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/5 border border-primary/10 px-3 py-1 rounded-full">
						Developer Ecosystem
					</span>
					<h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
						SopKit Developer Packages
					</h1>
					<p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
						Zero-dependency, strictly-typed JavaScript and TypeScript utilities compiled for modern web apps. Native ESM & CJS dual-format output.
					</p>
				</section>

				{/* Packages Grid */}
				<section className="container mx-auto max-w-5xl px-6 py-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{PACKAGES_DATA.map((pkg) => (
							<div
								key={pkg.id}
								className="p-6 rounded-2xl border border-border/40 bg-card/20 backdrop-blur-sm hover:border-primary/25 transition-all duration-300 flex flex-col justify-between space-y-5"
							>
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<span className="text-[10px] font-bold tracking-wider text-primary uppercase bg-primary/10 px-2 py-0.5 rounded">
											{pkg.badge}
										</span>
										<span className="text-[10px] text-muted-foreground font-mono">v1.0.0</span>
									</div>
									<h2 className="text-lg font-black text-foreground tracking-tight">
										{pkg.name}
									</h2>
									<p className="text-xs text-muted-foreground leading-relaxed">
										{pkg.description}
									</p>
								</div>

								<div className="space-y-4 pt-2">
									{/* Interactive Copy Command */}
									<div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-zinc-950/60 border border-border/20 font-mono text-xs text-zinc-300">
										<span className="truncate select-all">{pkg.installCmd}</span>
										<button
											onClick={() => handleCopy(pkg.id, pkg.installCmd)}
											className="p-1 hover:bg-zinc-850 rounded text-muted-foreground hover:text-foreground transition-colors shrink-0"
										>
											{copiedId === pkg.id ? (
												<Check className="h-3.5 w-3.5 text-emerald-500" />
											) : (
												<Copy className="h-3.5 w-3.5" />
											)}
										</button>
									</div>

									{/* Minimal Action Links */}
									<div className="flex flex-wrap gap-2 text-[11px] font-bold">
										<a
											href={pkg.npmLink}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
										>
											NPM <ExternalLink className="h-2.5 w-2.5" />
										</a>
										<span className="text-border/40">•</span>
										<a
											href={pkg.githubLink}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
										>
											GitHub <ExternalLink className="h-2.5 w-2.5" />
										</a>
										{pkg.toolLink && (
											<>
												<span className="text-border/40">•</span>
												<Link
													href={pkg.toolLink}
													className="inline-flex items-center gap-0.5 text-primary hover:underline"
												>
													Launch Tool <ArrowRight className="h-3 w-3" />
												</Link>
											</>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* Comparison Table */}
				<section className="container mx-auto max-w-5xl px-6 py-12 border-t border-border/10">
					<div className="text-center max-w-md mx-auto mb-8 space-y-1.5">
						<h2 className="text-xl font-bold tracking-tight">Ecosystem Architecture</h2>
						<p className="text-xs text-muted-foreground">
							How @sopkit libraries stack up against traditional packages.
						</p>
					</div>

					<div className="overflow-hidden rounded-xl border border-border/40 bg-card/10 backdrop-blur-sm">
						<table className="w-full text-left border-collapse text-xs">
							<thead>
								<tr className="border-b border-border/10 bg-muted/20 text-muted-foreground font-bold">
									<th className="p-4">Metric</th>
									<th className="p-4 text-primary">@sopkit Package</th>
									<th className="p-4">Standard Alternates</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border/10 text-muted-foreground">
								<tr className="hover:bg-card/5 transition-colors">
									<td className="p-4 font-semibold text-foreground">Dependencies</td>
									<td className="p-4 text-primary font-bold">0 (Zero external bloat)</td>
									<td className="p-4">Varies (multiple nested sub-deps)</td>
								</tr>
								<tr className="hover:bg-card/5 transition-colors">
									<td className="p-4 font-semibold text-foreground">Bundle Weight</td>
									<td className="p-4 text-primary font-bold">Ultra-light (&lt; 2KB avg)</td>
									<td className="p-4">Heavy (often includes legacy shims)</td>
								</tr>
								<tr className="hover:bg-card/5 transition-colors">
									<td className="p-4 font-semibold text-foreground">Format Native</td>
									<td className="p-4 text-primary font-bold">ESM + CommonJS (Dual build)</td>
									<td className="p-4">ESM-only or CJS-only</td>
								</tr>
								<tr className="hover:bg-card/5 transition-colors">
									<td className="p-4 font-semibold text-foreground">Types</td>
									<td className="p-4 text-primary font-bold">First-class strictly typed</td>
									<td className="p-4">Requires installing @types/ scope</td>
								</tr>
							</tbody>
						</table>
					</div>
				</section>
			</main>
			<AppleFooter categories={categories} />
		</div>
	);
}
