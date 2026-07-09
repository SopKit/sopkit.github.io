import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Package, Terminal, ArrowRight, ExternalLink, Code2, BookOpen, ChevronRight, ShieldAlert, Cpu } from "lucide-react";
import BreadcrumbsEnhanced from "@/components/seo/BreadcrumbsEnhanced";
import { Suspense } from "react";

// Package definition database
const PACKAGES_MAP: Record<string, any> = {
	cli: {
		name: "@sopkit/cli",
		badge: "CLI Tool",
		version: "1.0.0",
		description: "Interactive command-line interface dashboard for running all SopKit utilities directly inside your terminal.",
		npmLink: "https://www.npmjs.com/package/@sopkit/cli",
		githubLink: "https://github.com/SopKit/sopkit.github.io/tree/main/packages/cli",
		installCmd: "npx @sopkit/cli",
		detailedDesc: "SopKit CLI is designed for developers who love keyboard-first workflows. It packages all standard SopKit utilities (Base64, UUID, URL Slug, JSON, and Color convert) into a single, interactive CLI console. No web browser required.",
		rivals: {
			title: "Rivals Comparison",
			legacyName: "Individual manual shell scripts",
			reasons: [
				{ metric: "Workflow", ours: "Single interactive prompt console", legacy: "Fragmented CLI scripts" },
				{ metric: "Dependencies", ours: "1 dependency (prompts)", legacy: "Heavy node-modules trees" },
				{ metric: "Speed", ours: "Instant boots (< 50ms)", legacy: "Varies" }
			]
		},
		api: [
			{ name: "npx @sopkit/cli", desc: "Instantly run the interactive dashboard in your shell without permanent installations." },
			{ name: "npm i -g @sopkit/cli", desc: "Install globally to add the 'sopkit' shortcut tool." }
		],
		usage: `# Run standard dashboard
npx @sopkit/cli

# Run after global install
sopkit`
	},
	base64: {
		name: "@sopkit/base64",
		badge: "Encoding",
		version: "1.0.0",
		description: "Premium Unicode-safe and URL-safe Base64 encoder and decoder for both Browser and Node.js.",
		npmLink: "https://www.npmjs.com/package/@sopkit/base64",
		githubLink: "https://github.com/SopKit/sopkit.github.io/tree/main/packages/base64",
		installCmd: "npm install @sopkit/base64",
		toolLink: "/base64-encode/",
		detailedDesc: "Standard JavaScript btoa and atob functions fail on multi-byte UTF-8 Unicode characters (like Emojis). @sopkit/base64 fixes this natively, providing complete encoding safety and additional URL-Safe encoders.",
		rivals: {
			title: "Rivals Comparison",
			legacyName: "js-base64",
			reasons: [
				{ metric: "Unicode Safe", ours: "Built-in (Native standard fix)", legacy: "Requires custom buffer hacks" },
				{ metric: "URL Safe mode", ours: "Supported (urlEncode / urlDecode)", legacy: "Manual character replace needed" },
				{ metric: "Bundle size", ours: "1.05 KB (minified)", legacy: "4.8 KB" }
			]
		},
		api: [
			{ name: "encode(input: string): string", desc: "Encodes string into standard Base64 representation." },
			{ name: "decode(input: string): string", desc: "Decodes standard Base64 string back into UTF-8 representation." },
			{ name: "urlEncode(input: string): string", desc: "Encodes string into URL-safe Base64 representation." },
			{ name: "urlDecode(input: string): string", desc: "Decodes URL-safe Base64 representation." }
		],
		usage: `import { encode, decode, urlEncode, urlDecode } from "@sopkit/base64";

const enc = encode("SopKit 🚀"); // "U29wS2l0IPCZiQ=="
const dec = decode(enc); // "SopKit 🚀"`
	},
	uuid: {
		name: "@sopkit/uuid",
		badge: "Security & ID",
		version: "1.0.0",
		description: "Cryptographically secure, lightweight UUID v4 and v1 generator/validator.",
		npmLink: "https://www.npmjs.com/package/@sopkit/uuid",
		githubLink: "https://github.com/SopKit/sopkit.github.io/tree/main/packages/uuid",
		installCmd: "npm install @sopkit/uuid",
		toolLink: "/uuid-generator/",
		detailedDesc: "Provides cryptographically secure random identifiers (v4) using global Web Crypto API and timestamp-based (v1) UUIDs. Optimized for high concurrency, zero-dependency, and extreme performance.",
		rivals: {
			title: "Rivals Comparison",
			legacyName: "uuid",
			reasons: [
				{ metric: "Size", ours: "1.4 KB", legacy: "12 KB" },
				{ metric: "Dependencies", ours: "0 (Zero dependencies)", legacy: "2+ dependencies" },
				{ metric: "Standard Support", ours: "Native Web Crypto API", legacy: "Requires Node runtime shims" }
			]
		},
		api: [
			{ name: "v4(): string", desc: "Generates a secure UUID v4." },
			{ name: "v1(): string", desc: "Generates a timestamp-based UUID v1." },
			{ name: "validate(uuid: string): boolean", desc: "Validates string structure." }
		],
		usage: `import { v4, validate } from "@sopkit/uuid";

const id = v4(); // "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
console.log(validate(id)); // true`
	},
	slug: {
		name: "@sopkit/slug",
		badge: "Text Utility",
		version: "1.0.0",
		description: "Multilingual URL-safe slug generator with complete accent and diacritics normalization.",
		npmLink: "https://www.npmjs.com/package/@sopkit/slug",
		githubLink: "https://github.com/SopKit/sopkit.github.io/tree/main/packages/slug",
		installCmd: "npm install @sopkit/slug",
		toolLink: "/slug-generator/",
		detailedDesc: "Translates complex accent characters (like é, ü, ç, ö) into regular ASCII representations. Clean URL optimization ensures symbols are stripped correctly to boost SEO visibility.",
		rivals: {
			title: "Rivals Comparison",
			legacyName: "slugify",
			reasons: [
				{ metric: "Diacritics fix", ours: "Unicode normalisation mapping", legacy: "Manual replace arrays" },
				{ metric: "Dependencies", ours: "0 (Zero dependencies)", legacy: "Includes nested dependencies" },
				{ metric: "Bundle size", ours: "1.05 KB", legacy: "6 KB" }
			]
		},
		api: [
			{ name: "slugify(text: string, options?: SlugOptions): string", desc: "Converts text to slug with customized options." },
			{ name: "isValid(slug: string): boolean", desc: "Checks if a string conforms to slug format." }
		],
		usage: `import { slugify } from "@sopkit/slug";

const slug = slugify("Café & Résumé!", { lowercase: true }); // "cafe-resume"`
	},
	json: {
		name: "@sopkit/json",
		badge: "Developer Tools",
		version: "1.0.0",
		description: "Fast JSON syntax validator with precise line/column reporting, formatting, and minification.",
		npmLink: "https://www.npmjs.com/package/@sopkit/json",
		githubLink: "https://github.com/SopKit/sopkit.github.io/tree/main/packages/json",
		installCmd: "npm install @sopkit/json",
		toolLink: "/json-formatter/",
		detailedDesc: "Standard JSON.parse errors are notoriously vague. @sopkit/json parses raw strings and details precisely where a syntax error occurred, returning line numbers and column positions to improve development velocity.",
		rivals: {
			title: "Rivals Comparison",
			legacyName: "jsonlint",
			reasons: [
				{ metric: "Size", ours: "1.53 KB", legacy: "34 KB" },
				{ metric: "Dependencies", ours: "0 (Zero dependencies)", legacy: "2+ dependencies" },
				{ metric: "Precision", ours: "Detailed V8/JSC regex index mapping", legacy: "Basic parser exceptions" }
			]
		},
		api: [
			{ name: "validate(jsonStr: string): ValidationResult", desc: "Parses and returns validation details." },
			{ name: "format(jsonStr: string, options?: FormatOptions): string", desc: "Beautifies JSON with custom spacing." },
			{ name: "minify(jsonStr: string): string", desc: "Collapses JSON layout." }
		],
		usage: `import { validate } from "@sopkit/json";

const res = validate("{invalid}");
console.log(res.line, res.column); // prints line/col offsets`
	},
	color: {
		name: "@sopkit/color",
		badge: "Design Utility",
		version: "1.0.0",
		description: "High-performance colorspace converter supporting HEX, RGB, and HSL representations.",
		npmLink: "https://www.npmjs.com/package/@sopkit/color",
		githubLink: "https://github.com/SopKit/sopkit.github.io/tree/main/packages/color",
		installCmd: "npm install @sopkit/color",
		toolLink: "/color-converter/",
		detailedDesc: "A lightweight color math engine. Ideal for dynamic themes, UI dashboards, canvas rendering, and color palette creation.",
		rivals: {
			title: "Rivals Comparison",
			legacyName: "color / color-convert",
			reasons: [
				{ metric: "Dependencies", ours: "0 (Zero dependencies)", legacy: "Has downstream dependencies" },
				{ metric: "Weight", ours: "2.3 KB", legacy: "28 KB" },
				{ metric: "Tree-Shaking", ours: "Fully supported (ESM Named exports)", legacy: "Often imports large modules" }
			]
		},
		api: [
			{ name: "hexToRgb(hex: string): RGB", desc: "Converts HEX color string to RGB." },
			{ name: "rgbToHex(r, g, b): string", desc: "Converts RGB components to HEX." },
			{ name: "rgbToHsl(r, g, b): HSL", desc: "Converts RGB to HSL components." },
			{ name: "hslToRgb(h, s, l): RGB", desc: "Converts HSL to RGB components." }
		],
		usage: `import { hexToRgb, rgbToHsl } from "@sopkit/color";

const rgb = hexToRgb("#3b82f6");
const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);`
	},
	validator: {
		name: "@sopkit/validator",
		badge: "Validation",
		version: "1.0.0",
		description: "Fast, zero-dependency validation suite for email, URLs, domains, IP addresses, credit cards, and MAC addresses.",
		npmLink: "https://www.npmjs.com/package/@sopkit/validator",
		githubLink: "https://github.com/SopKit/sopkit.github.io/tree/main/packages/validator",
		installCmd: "npm install @sopkit/validator",
		toolLink: "/seotoolkit/",
		detailedDesc: "Legitimate email, credit card, and URL validators are often bloated. @sopkit/validator consolidates top-tier regex patterns and Luhn checkers into an extremely small package.",
		rivals: {
			title: "Rivals Comparison",
			legacyName: "validator",
			reasons: [
				{ metric: "Dependencies", ours: "0 (Zero dependencies)", legacy: "0" },
				{ metric: "Bundle size", ours: "2.23 KB", legacy: "42 KB" },
				{ metric: "Optimization", ours: "Strict tree-shaking support", legacy: "Often imports the whole library" }
			]
		},
		api: [
			{ name: "isEmail(email: string): boolean", desc: "Validates email address format." },
			{ name: "isUrl(url: string): boolean", desc: "Checks for valid parseable URL links." },
			{ name: "isDomain(domain: string): boolean", desc: "Checks domain name format." },
			{ name: "isIp(ip: string): boolean", desc: "Checks IPv4 or IPv6 format." },
			{ name: "isCreditCard(cardNumber: string): boolean", desc: "Checks credit cards using Luhn algorithm." }
		],
		usage: `import { isEmail, isCreditCard } from "@sopkit/validator";

isEmail("test@sopkit.com"); // true
isCreditCard("49927398716");`
	},
	password: {
		name: "@sopkit/password",
		badge: "Security & Crypto",
		version: "1.0.0",
		description: "Customizable password generator and security entropy analyzer using information entropy.",
		npmLink: "https://www.npmjs.com/package/@sopkit/password",
		githubLink: "https://github.com/SopKit/sopkit.github.io/tree/main/packages/password",
		installCmd: "npm install @sopkit/password",
		toolLink: "/password-generator/",
		detailedDesc: "Generate secure random string passwords and perform strength checks based on pool variety and bit entropy (Shannon Entropy scale) rather than basic length metrics.",
		rivals: {
			title: "Rivals Comparison",
			legacyName: "generate-password / password-sheriff",
			reasons: [
				{ metric: "Entropy Checks", ours: "Supported (calculates bits of entropy)", legacy: "Rarely supported natively" },
				{ metric: "Bundle size", ours: "3.1 KB", legacy: "18 KB" },
				{ metric: "Guaranteed chars", ours: "Forces 1 char from each enabled pool", legacy: "Varies" }
			]
		},
		api: [
			{ name: "generate(options?: GeneratorOptions): string", desc: "Generates secure random password." },
			{ name: "analyze(password: string): StrengthResult", desc: "Returns score, label, entropy, and tips." }
		],
		usage: `import { generate, analyze } from "@sopkit/password";

const pass = generate({ length: 16 });
const res = analyze(pass);`
	}
};

interface PageProps {
	params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
	return Object.keys(PACKAGES_MAP).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const pkg = PACKAGES_MAP[slug];
	if (!pkg) return {};

	return {
		title: `${pkg.name} — Premium Developer Package`,
		description: pkg.description,
		alternates: {
			canonical: `https://sopkit.github.io/packages/${slug}/`,
		},
		openGraph: {
			title: `${pkg.name} — Reusable TypeScript Utility`,
			description: pkg.description,
			url: `https://sopkit.github.io/packages/${slug}/`,
			images: [{ url: "/og-images/packages.png" }],
		},
	};
}

export default async function PackageDetailPage({ params }: PageProps) {
	const { slug } = await params;
	const pkg = PACKAGES_MAP[slug];

	if (!pkg) {
		notFound();
	}

	const packageSchema = {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		"name": pkg.name,
		"description": pkg.description,
		"applicationCategory": "DeveloperApplication",
		"operatingSystem": "All",
		"releaseNotes": `v${pkg.version}`,
		"offers": {
			"@type": "Offer",
			"price": "0",
			"priceCurrency": "USD"
		}
	};

	return (
		<div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(packageSchema),
				}}
			/>
			<main className="flex-grow">
				{/* Top Header */}
				<section className="relative overflow-hidden bg-gradient-to-b from-primary/[0.03] via-transparent to-transparent py-12 md:py-16 border-b border-border/10">
					<div className="container mx-auto max-w-5xl px-4">
						<Suspense fallback={null}>
							<BreadcrumbsEnhanced suppressSchema={true} />
						</Suspense>

						<div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
							<div className="space-y-3">
								<div className="flex items-center gap-3">
									<span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded">
										{pkg.badge}
									</span>
									<span className="text-xs font-semibold text-muted-foreground">
										v{pkg.version}
									</span>
								</div>
								<h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
									{pkg.name}
								</h1>
								<p className="text-base text-muted-foreground max-w-3xl leading-relaxed">
									{pkg.description}
								</p>
							</div>

							<div className="flex flex-wrap gap-2 md:self-end">
								<a
									href={pkg.npmLink}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-bold text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-200"
								>
									<Package className="h-3.5 w-3.5" />
									NPM Page
									<ExternalLink className="h-3 w-3" />
								</a>
								<a
									href={pkg.githubLink}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-bold text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-200"
								>
									<Code2 className="h-3.5 w-3.5" />
									GitHub
									<ExternalLink className="h-3 w-3" />
								</a>
								{pkg.toolLink && (
									<Link
										href={pkg.toolLink}
										className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-5 py-2 text-xs font-bold hover:opacity-90 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.1)]"
									>
										Try Online Tool
										<ArrowRight className="h-3.5 w-3.5" />
									</Link>
								)}
							</div>
						</div>
					</div>
				</section>

				{/* Documentation Grid */}
				<section className="container mx-auto max-w-5xl px-4 py-12 md:py-16">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Left Column: Docs & Details */}
						<div className="lg:col-span-2 space-y-10">
							<div className="space-y-4">
								<h2 className="text-xl md:text-2xl font-extrabold tracking-tight">Overview</h2>
								<p className="text-sm md:text-base text-muted-foreground leading-relaxed">
									{pkg.detailedDesc}
								</p>
							</div>

							{/* Installation */}
							<div className="space-y-4">
								<div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
									<Terminal className="h-4 w-4 text-primary" />
									<span>Installation</span>
								</div>
								<pre className="p-4 rounded-2xl border border-border/40 bg-muted/40 font-mono text-xs overflow-x-auto text-foreground leading-relaxed">
									{pkg.installCmd}
								</pre>
							</div>

							{/* Quick Start */}
							<div className="space-y-4">
								<div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
									<Code2 className="h-4 w-4 text-primary" />
									<span>Quick Start (ESM)</span>
								</div>
								<pre className="p-4 rounded-2xl border border-border/40 bg-muted/40 font-mono text-xs overflow-x-auto text-foreground leading-relaxed">
									{pkg.usage}
								</pre>
							</div>

							{/* API Reference */}
							<div className="space-y-4">
								<div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
									<BookOpen className="h-4 w-4 text-primary" />
									<span>API Reference</span>
								</div>
								<div className="border border-border/40 rounded-2xl overflow-hidden divide-y divide-border/10 bg-card/10">
									{pkg.api.map((method: any, idx: number) => (
										<div key={idx} className="p-4 space-y-1.5 hover:bg-muted/5 transition-colors">
											<code className="text-xs font-bold text-primary block break-words">
												{method.name}
											</code>
											<p className="text-xs text-muted-foreground leading-relaxed">
												{method.desc}
											</p>
										</div>
									))}
								</div>
							</div>
						</div>

						{/* Right Column: Rival Comparison Box */}
						<div className="space-y-6">
							<div className="p-6 rounded-3xl border border-border/40 bg-card/20 backdrop-blur-sm shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6">
								<div className="flex items-center gap-2">
									<Cpu className="h-5 w-5 text-primary" />
									<h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
										{pkg.rivals.title}
									</h3>
								</div>

								<div className="space-y-4">
									<p className="text-xs text-muted-foreground leading-relaxed">
										How <strong>{pkg.name}</strong> compares against the typical industry standard (<strong>{pkg.rivals.legacyName}</strong>):
									</p>

									<div className="divide-y divide-border/10 space-y-3">
										{pkg.rivals.reasons.map((reason: any, idx: number) => (
											<div key={idx} className="pt-3 space-y-1 text-xs">
												<div className="font-semibold text-muted-foreground">{reason.metric}</div>
												<div className="flex justify-between items-center gap-4 mt-1">
													<span className="text-primary font-bold">{reason.ours}</span>
													<span className="text-muted-foreground/60 line-through">{reason.legacy}</span>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>

							<div className="p-6 rounded-3xl border border-border/40 bg-primary/5 space-y-4">
								<div className="flex items-center gap-2">
									<ChevronRight className="h-5 w-5 text-primary animate-pulse" />
									<h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
										SopKit Guarantee
									</h4>
								</div>
								<p className="text-xs text-muted-foreground leading-relaxed">
									All libraries in the SopKit ecosystem are guaranteed to have <strong>zero server calls</strong>, <strong>zero analytical trackers</strong>, and <strong>100% client-side privacy-first execution</strong>.
								</p>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
