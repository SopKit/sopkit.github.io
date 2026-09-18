"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, Copy, Check, Search, Terminal, Sparkles, BookOpen } from "lucide-react";
import { GridPattern } from "@/components/shared/GridPattern";
import { GITHUB_REPO_URL } from "@/constants/config";
import { trackPackageCopy } from "@/lib/analytics";

export interface PackageItem {
	id: string;
	name: string;
	description: string;
	category: "media" | "cli" | "crypto" | "encoding" | "data" | "security";
	categoryLabel: string;
	npmLink: string;
	githubLink: string;
	packageBase: string; // e.g. "@sopkit/player"
	isExec?: boolean; // npx command vs package install
	badge: string;
	toolLink?: string;
	version: string;
	bundleSize: string;
}

const ALL_PACKAGES: PackageItem[] = [
	{
		id: "player",
		name: "@sopkit/player",
		description: "Zero-dependency, high-performance HTML5 video player engine with custom controls, PiP, keyboard shortcuts, and theme styling.",
		category: "media",
		categoryLabel: "Media & Player",
		npmLink: "https://www.npmjs.com/package/@sopkit/player",
		githubLink: `${GITHUB_REPO_URL}/tree/main/packages/player`,
		packageBase: "@sopkit/player",
		badge: "Media Engine",
		toolLink: "/ai-video-summarizer",
		version: "1.0.0",
		bundleSize: "< 4.2 KB",
	},
	{
		id: "cli",
		name: "@sopkit/cli",
		description: "Interactive, mouse-and-keyboard driven terminal TUI dashboard for running 20+ SopKit developer utilities directly in your shell.",
		category: "cli",
		categoryLabel: "CLI & Terminal",
		npmLink: "https://www.npmjs.com/package/@sopkit/cli",
		githubLink: `${GITHUB_REPO_URL}/tree/main/packages/cli`,
		packageBase: "@sopkit/cli",
		isExec: true,
		badge: "Terminal App",
		version: "1.2.0",
		bundleSize: "Zero Dep",
	},
	{
		id: "hash",
		name: "@sopkit/hash",
		description: "Ultra-fast cryptographic hashing suite (SHA-256, SHA-512, SHA-1, MD5, HMAC) with timing-safe string comparison.",
		category: "crypto",
		categoryLabel: "Crypto & Hash",
		npmLink: "https://www.npmjs.com/package/@sopkit/hash",
		githubLink: `${GITHUB_REPO_URL}/tree/main/packages/hash`,
		packageBase: "@sopkit/hash",
		badge: "Crypto & Hash",
		toolLink: "/sha256-hash-generator",
		version: "1.0.0",
		bundleSize: "1.6 KB",
	},
	{
		id: "base64",
		name: "@sopkit/base64",
		description: "High-performance, URL-safe Base64 encoding and decoding with native UTF-8 and Unicode character safety.",
		category: "encoding",
		categoryLabel: "Encoding",
		npmLink: "https://www.npmjs.com/package/@sopkit/base64",
		githubLink: `${GITHUB_REPO_URL}/tree/main/packages/base64`,
		packageBase: "@sopkit/base64",
		badge: "Encoding",
		toolLink: "/base64-tool",
		version: "1.0.0",
		bundleSize: "1.0 KB",
	},
	{
		id: "uuid",
		name: "@sopkit/uuid",
		description: "Cryptographically secure UUID v4 (random) and v1 (timestamp) generation and validation library for modern runtimes.",
		category: "security",
		categoryLabel: "Security & ID",
		npmLink: "https://www.npmjs.com/package/@sopkit/uuid",
		githubLink: `${GITHUB_REPO_URL}/tree/main/packages/uuid`,
		packageBase: "@sopkit/uuid",
		badge: "Security & ID",
		toolLink: "/uuid-generator",
		version: "1.0.0",
		bundleSize: "1.1 KB",
	},
	{
		id: "slug",
		name: "@sopkit/slug",
		description: "Accent-normalized, multilingual URL slug generator built for SEO-friendly web routing and clean path generation.",
		category: "data",
		categoryLabel: "Data & Text",
		npmLink: "https://www.npmjs.com/package/@sopkit/slug",
		githubLink: `${GITHUB_REPO_URL}/tree/main/packages/slug`,
		packageBase: "@sopkit/slug",
		badge: "SEO / Text",
		toolLink: "/slug-generator",
		version: "1.0.0",
		bundleSize: "1.2 KB",
	},
	{
		id: "password",
		name: "@sopkit/password",
		description: "Secure local client-side password entropy evaluator and custom validator matching strict NIST security patterns.",
		category: "security",
		categoryLabel: "Security & Auth",
		npmLink: "https://www.npmjs.com/package/@sopkit/password",
		githubLink: `${GITHUB_REPO_URL}/tree/main/packages/password`,
		packageBase: "@sopkit/password",
		badge: "Crypto & Auth",
		toolLink: "/secure-password-generator",
		version: "1.0.0",
		bundleSize: "1.8 KB",
	},
	{
		id: "color",
		name: "@sopkit/color",
		description: "Ultra-fast color code parser and dual conversion utility (HEX, RGB, HSL) with zero external dependencies.",
		category: "data",
		categoryLabel: "Design & Color",
		npmLink: "https://www.npmjs.com/package/@sopkit/color",
		githubLink: `${GITHUB_REPO_URL}/tree/main/packages/color`,
		packageBase: "@sopkit/color",
		badge: "Design",
		toolLink: "/rgb-to-hex-converter",
		version: "1.0.0",
		bundleSize: "1.4 KB",
	},
	{
		id: "json",
		name: "@sopkit/json",
		description: "High-performance JSON formatter, minifier, and validator with precise line and column syntax error detection.",
		category: "data",
		categoryLabel: "Data & Format",
		npmLink: "https://www.npmjs.com/package/@sopkit/json",
		githubLink: `${GITHUB_REPO_URL}/tree/main/packages/json`,
		packageBase: "@sopkit/json",
		badge: "Developer Tools",
		toolLink: "/json-formatter",
		version: "1.0.0",
		bundleSize: "1.9 KB",
	},
	{
		id: "validator",
		name: "@sopkit/validator",
		description: "Strict, zero-dependency validation suite for emails, domains, URLs, IP addresses, and credit cards.",
		category: "security",
		categoryLabel: "Validation",
		npmLink: "https://www.npmjs.com/package/@sopkit/validator",
		githubLink: `${GITHUB_REPO_URL}/tree/main/packages/validator`,
		packageBase: "@sopkit/validator",
		badge: "Validation",
		toolLink: "/email-validator",
		version: "1.0.0",
		bundleSize: "2.1 KB",
	},
	{
		id: "xml",
		name: "@sopkit/xml",
		description: "Lightweight, zero-dependency XML parser, formatter, validator, and minifier with customizable indentation.",
		category: "data",
		categoryLabel: "Data & Format",
		npmLink: "https://www.npmjs.com/package/@sopkit/xml",
		githubLink: `${GITHUB_REPO_URL}/tree/main/packages/xml`,
		packageBase: "@sopkit/xml",
		badge: "Developer Tools",
		toolLink: "/xml-formatter",
		version: "1.0.0",
		bundleSize: "2.4 KB",
	},
	{
		id: "jwt",
		name: "@sopkit/jwt",
		description: "Unicode-safe JSON Web Token (JWT) decoder and format validator checking claims, header, and payload client-side.",
		category: "security",
		categoryLabel: "Security & Auth",
		npmLink: "https://www.npmjs.com/package/@sopkit/jwt",
		githubLink: `${GITHUB_REPO_URL}/tree/main/packages/jwt`,
		packageBase: "@sopkit/jwt",
		badge: "Security & Auth",
		toolLink: "/jwt-decoder",
		version: "1.0.0",
		bundleSize: "1.5 KB",
	},
];

type PackageManager = "npm" | "pnpm" | "bun" | "yarn";

export default function PackagesGrid() {
	const [search, setSearch] = useState("");
	const [activeCategory, setActiveCategory] = useState<string>("all");
	const [packageManager, setPackageManager] = useState<PackageManager>("npm");
	const [copiedId, setCopiedId] = useState<string | null>(null);

	const categories = [
		{ id: "all", label: "All Packages" },
		{ id: "media", label: "Media & Player" },
		{ id: "cli", label: "CLI & Terminal" },
		{ id: "crypto", label: "Crypto & Hash" },
		{ id: "encoding", label: "Encoding" },
		{ id: "data", label: "Data & Format" },
		{ id: "security", label: "Security & Auth" },
	];

	const filteredPackages = useMemo(() => {
		const q = search.trim().toLowerCase();
		return ALL_PACKAGES.filter((pkg) => {
			const matchesCategory = activeCategory === "all" || pkg.category === activeCategory;
			const matchesSearch =
				!q ||
				pkg.name.toLowerCase().includes(q) ||
				pkg.description.toLowerCase().includes(q) ||
				pkg.badge.toLowerCase().includes(q) ||
				pkg.categoryLabel.toLowerCase().includes(q);
			return matchesCategory && matchesSearch;
		});
	}, [search, activeCategory]);

	const getInstallCommand = (pkg: PackageItem, pm: PackageManager): string => {
		if (pkg.isExec) {
			if (pm === "pnpm") return `pnpm dlx ${pkg.packageBase}`;
			if (pm === "bun") return `bunx ${pkg.packageBase}`;
			if (pm === "yarn") return `yarn dlx ${pkg.packageBase}`;
			return `npx ${pkg.packageBase}`;
		}

		if (pm === "pnpm") return `pnpm add ${pkg.packageBase}`;
		if (pm === "bun") return `bun add ${pkg.packageBase}`;
		if (pm === "yarn") return `yarn add ${pkg.packageBase}`;
		return `npm install ${pkg.packageBase}`;
	};

	const handleCopy = async (pkg: PackageItem) => {
		const cmd = getInstallCommand(pkg, packageManager);
		try {
			await navigator.clipboard.writeText(cmd);
			trackPackageCopy(pkg.name, packageManager);
			setCopiedId(pkg.id);
			setTimeout(() => setCopiedId(null), 2000);
		} catch (err) {
			console.error("Copy failed", err);
		}
	};

	return (
		<div className="min-h-screen bg-background flex flex-col font-sans relative overflow-hidden">
			<main className="flex-1 relative z-10">
				<GridPattern className="opacity-[0.03]" />

				{/* Hero Section */}
				<section className="container mx-auto max-w-5xl px-6 pt-16 pb-10 text-center space-y-4">
					<div className="flex items-center justify-center gap-2">
						<span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/60 px-3 py-1 rounded-full shadow-sm">
							<Sparkles className="h-3 w-3" /> Zero-Dependency NPM Ecosystem
						</span>
					</div>
					<h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
						SopKit Developer Packages
					</h1>
					<p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
						Strictly typed, ultra-lightweight TypeScript and JavaScript packages for modern web applications.
						Dual ESM + CJS output, zero external dependencies, free and open source forever.
					</p>

					{/* Global Package Manager Switcher */}
					<div className="pt-2 flex items-center justify-center">
						<div className="inline-flex items-center p-1 rounded-xl bg-muted/60 border border-border/60 text-xs font-mono">
							{(["npm", "pnpm", "bun", "yarn"] as PackageManager[]).map((pm) => (
								<button
									key={pm}
									onClick={() => setPackageManager(pm)}
									className={`px-3 py-1 rounded-lg font-semibold transition-all ${
										packageManager === pm
											? "bg-background text-foreground shadow-sm border border-border/40"
											: "text-muted-foreground hover:text-foreground"
									}`}
								>
									{pm}
								</button>
							))}
						</div>
					</div>
				</section>

				{/* Search & Filter Controls */}
				<section className="container mx-auto max-w-5xl px-6 pb-6 space-y-4">
					<div className="flex flex-col md:flex-row gap-3 items-center justify-between">
						{/* Real-time search bar */}
						<div className="relative w-full md:max-w-md">
							<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<input
								type="text"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Search packages (e.g. player, hash, base64)..."
								className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-card border border-border/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all text-foreground placeholder:text-muted-foreground/70"
							/>
							{search && (
								<button
									onClick={() => setSearch("")}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
								>
									✕
								</button>
							)}
						</div>

						{/* Results Count */}
						<div className="text-xs text-muted-foreground font-mono shrink-0">
							Showing {filteredPackages.length} of {ALL_PACKAGES.length} packages
						</div>
					</div>

					{/* Category Filter Pills */}
					<div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
						{categories.map((cat) => (
							<button
								key={cat.id}
								onClick={() => setActiveCategory(cat.id)}
								className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
									activeCategory === cat.id
										? "bg-primary text-primary-foreground font-bold shadow-sm"
										: "bg-secondary/70 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/40"
								}`}
							>
								{cat.label}
							</button>
						))}
					</div>
				</section>

				{/* Packages Grid */}
				<section className="container mx-auto max-w-5xl px-6 py-2">
					{filteredPackages.length === 0 ? (
						<div className="text-center py-16 p-8 rounded-2xl border border-dashed border-border/60 bg-card/40 space-y-3">
							<p className="text-sm font-semibold text-foreground">No packages matched "{search}"</p>
							<button
								onClick={() => {
									setSearch("");
									setActiveCategory("all");
								}}
								className="text-xs text-cyan-500 hover:underline font-medium"
							>
								Reset search filters
							</button>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{filteredPackages.map((pkg) => {
								const installCmd = getInstallCommand(pkg, packageManager);
								return (
									<div
										key={pkg.id}
										className="p-6 rounded-2xl border border-border/70 bg-card hover:border-cyan-500/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-5 group"
									>
										<div className="space-y-3">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													<span className="text-[10px] font-bold tracking-wider text-cyan-600 dark:text-cyan-400 uppercase bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-900/60 px-2 py-0.5 rounded-md">
														{pkg.badge}
													</span>
													<span className="text-[10px] text-muted-foreground font-mono font-semibold">
														{pkg.bundleSize}
													</span>
												</div>
												<span className="text-[10px] text-muted-foreground font-mono font-semibold">
													v{pkg.version}
												</span>
											</div>

											<div className="space-y-1">
												<Link
													href={`/packages/${pkg.id}`}
													className="text-xl font-bold text-foreground tracking-tight hover:text-cyan-500 transition-colors flex items-center gap-1.5"
												>
													{pkg.name}
													<ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-cyan-500" />
												</Link>
												<p className="text-xs text-muted-foreground leading-relaxed">
													{pkg.description}
												</p>
											</div>
										</div>

										<div className="space-y-4 pt-2">
											{/* Interactive Copy Command */}
											<div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-zinc-950/90 dark:bg-zinc-900/90 border border-border/30 font-mono text-[11px] text-zinc-300 shadow-inner group/copy">
												<span className="truncate select-all text-cyan-300/90">{installCmd}</span>
												<button
													onClick={() => handleCopy(pkg)}
													title={`Copy ${packageManager} install command`}
													className="p-1.5 hover:bg-zinc-800 rounded-lg text-muted-foreground hover:text-foreground transition-colors shrink-0"
												>
													{copiedId === pkg.id ? (
														<Check className="h-3.5 w-3.5 text-emerald-400" />
													) : (
														<Copy className="h-3.5 w-3.5" />
													)}
												</button>
											</div>

											{/* Action Links */}
											<div className="flex flex-wrap gap-2.5 text-[11px] font-medium items-center text-muted-foreground">
												<Link
													href={`/packages/${pkg.id}`}
													className="inline-flex items-center gap-1 text-foreground hover:text-cyan-500 transition-colors font-semibold"
												>
													<BookOpen className="h-3 w-3" /> Docs & API
												</Link>
												<span className="text-border/40">•</span>
												<a
													href={pkg.npmLink}
													target="_blank"
													rel="noopener noreferrer"
													className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
												>
													NPM <ExternalLink className="h-2.5 w-2.5" />
												</a>
												<span className="text-border/40">•</span>
												<a
													href={pkg.githubLink}
													target="_blank"
													rel="noopener noreferrer"
													className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
												>
													GitHub <ExternalLink className="h-2.5 w-2.5" />
												</a>
												{pkg.toolLink && (
													<>
														<span className="text-border/40">•</span>
														<Link
															href={pkg.toolLink}
															className="inline-flex items-center gap-0.5 text-cyan-600 dark:text-cyan-400 hover:underline font-semibold"
														>
															Live Demo <ArrowRight className="h-3 w-3 ml-0.5" />
														</Link>
													</>
												)}
											</div>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</section>

				{/* Architecture Comparison Table */}
				<section className="container mx-auto max-w-5xl px-6 py-14 border-t border-border/20 mt-10">
					<div className="text-center max-w-md mx-auto mb-8 space-y-1.5">
						<h2 className="text-xl font-bold tracking-tight">Ecosystem Architecture</h2>
						<p className="text-xs text-muted-foreground">
							How @sopkit libraries stack up against traditional NPM packages.
						</p>
					</div>

					<div className="overflow-hidden rounded-2xl border border-border/60 bg-card/40 backdrop-blur-md shadow-lg">
						<table className="w-full text-left border-collapse text-xs">
							<thead>
								<tr className="border-b border-border/20 bg-muted/40 text-muted-foreground font-bold">
									<th className="p-4">Metric</th>
									<th className="p-4 text-cyan-600 dark:text-cyan-400 font-bold">@sopkit Package</th>
									<th className="p-4">Standard Alternates</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border/15 text-muted-foreground">
								<tr className="hover:bg-muted/20 transition-colors">
									<td className="p-4 font-semibold text-foreground">Dependencies</td>
									<td className="p-4 text-cyan-600 dark:text-cyan-400 font-bold">0 (Zero external bloat)</td>
									<td className="p-4">Varies (multiple nested sub-deps)</td>
								</tr>
								<tr className="hover:bg-muted/20 transition-colors">
									<td className="p-4 font-semibold text-foreground">Bundle Weight</td>
									<td className="p-4 text-cyan-600 dark:text-cyan-400 font-bold">Ultra-light (&lt; 2KB avg)</td>
									<td className="p-4">Heavy (often includes legacy shims)</td>
								</tr>
								<tr className="hover:bg-muted/20 transition-colors">
									<td className="p-4 font-semibold text-foreground">Format Native</td>
									<td className="p-4 text-cyan-600 dark:text-cyan-400 font-bold">ESM + CommonJS (Dual build)</td>
									<td className="p-4">ESM-only or CJS-only</td>
								</tr>
								<tr className="hover:bg-muted/20 transition-colors">
									<td className="p-4 font-semibold text-foreground">Types</td>
									<td className="p-4 text-cyan-600 dark:text-cyan-400 font-bold">First-class strictly typed (.d.ts)</td>
									<td className="p-4">Requires installing @types/ scope</td>
								</tr>
							</tbody>
						</table>
					</div>
				</section>
			</main>
		</div>
	);
}
