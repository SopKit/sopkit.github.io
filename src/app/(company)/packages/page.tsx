import { Metadata } from "next";
import Link from "next/link";
import { Package, Terminal, ArrowRight, ExternalLink, Code2, BookOpen } from "lucide-react";
import BreadcrumbsEnhanced from "@/components/seo/BreadcrumbsEnhanced";
import { Suspense } from "react";

export const metadata: Metadata = {
	title: "SopKit NPM Ecosystem — Reusable Developer Packages",
	description: "Access SopKit's core utility libraries. Zero-dependency, strictly typed TypeScript packages for Base64, UUID, URL Slug, JSON, Color space, and validation.",
	alternates: {
		canonical: "https://sopkit.github.io/packages/",
	},
	openGraph: {
		title: "SopKit NPM Ecosystem — Reusable Developer Packages",
		description: "High-performance, zero-dependency, and strictly typed TypeScript utilities for browser and Node.js.",
		url: "https://sopkit.github.io/packages",
		images: [{ url: "/og-image.jpg" }],
	},
};

const PACKAGES_DATA = [
	{
		id: "cli",
		name: "@sopkit/cli",
		description: "An interactive, prompt-driven command-line interface to run any SopKit developer utility directly in your terminal.",
		npmLink: "https://www.npmjs.com/package/@sopkit/cli",
		githubLink: "https://github.com/SopKit/sopkit.github.io/tree/main/packages/cli",
		installCmd: "npx @sopkit/cli",
		badge: "CLI Tool",
		isCli: true,
		api: [
			{ name: "npx @sopkit/cli", desc: "Launch the interactive utility dashboard." },
			{ name: "npm i -g @sopkit/cli", desc: "Install globally to enable the 'sopkit' terminal command." }
		],
		usage: `# Run directly without installation
npx @sopkit/cli

# Or install globally
npm install -g @sopkit/cli
sopkit`
	},
	{
		id: "base64",
		name: "@sopkit/base64",
		description: "Full Unicode and URL-Safe Base64 encoder and decoder for both Browser and Node.js.",
		npmLink: "https://www.npmjs.com/package/@sopkit/base64",
		githubLink: "https://github.com/SopKit/sopkit.github.io/tree/main/packages/base64",
		installCmd: "npm install @sopkit/base64",
		toolLink: "/base64-encode/",
		badge: "Encoding",
		api: [
			{ name: "encode(input: string): string", desc: "Encodes string into standard Base64 representation (supports full UTF-8 Unicode)." },
			{ name: "decode(input: string): string", desc: "Decodes standard Base64 string back into original UTF-8 string." },
			{ name: "urlEncode(input: string): string", desc: "Encodes into URL-safe Base64 representation (+ ➜ -, / ➜ _, strips =)." },
			{ name: "urlDecode(input: string): string", desc: "Decodes URL-safe Base64 representation." },
			{ name: "isValid(input: string): boolean", desc: "Returns true if the input is a valid Base64 string." }
		],
		usage: `import { encode, decode, urlEncode, urlDecode } from "@sopkit/base64";

const encoded = encode("Hello World 🚀");
console.log(encoded); // "SGVsbG8gV29ybGQg8J+Zog=="

const decoded = decode(encoded);
console.log(decoded); // "Hello World 🚀"`
	},
	{
		id: "uuid",
		name: "@sopkit/uuid",
		description: "Cryptographically secure UUID v4 (random) and v1 (timestamp) generator and validator.",
		npmLink: "https://www.npmjs.com/package/@sopkit/uuid",
		githubLink: "https://github.com/SopKit/sopkit.github.io/tree/main/packages/uuid",
		installCmd: "npm install @sopkit/uuid",
		toolLink: "/uuid-generator/",
		badge: "Security & ID",
		api: [
			{ name: "v4(): string", desc: "Generates a cryptographically secure random UUID v4." },
			{ name: "v1(): string", desc: "Generates a timestamp-based UUID v1." },
			{ name: "validate(uuid: string): boolean", desc: "Validates if the given string is a valid UUID structure." },
			{ name: "getVersion(uuid: string): number | null", desc: "Returns the UUID version (1-5) or null if invalid." }
		],
		usage: `import { v4, validate, getVersion } from "@sopkit/uuid";

const id = v4(); // "f81d4fae-7dec-11d0-a765-00a0c91e6bf6"
console.log(validate(id)); // true
console.log(getVersion(id)); // 4`
	},
	{
		id: "slug",
		name: "@sopkit/slug",
		description: "Accent-normalized, URL-safe multilingual slug generator for SEO and clean URLs.",
		npmLink: "https://www.npmjs.com/package/@sopkit/slug",
		githubLink: "https://github.com/SopKit/sopkit.github.io/tree/main/packages/slug",
		installCmd: "npm install @sopkit/slug",
		toolLink: "/slug-generator/",
		badge: "Text Utility",
		api: [
			{ name: "slugify(text: string, options?: SlugOptions): string", desc: "Generates a clean slug (decomposes accents/diacritics, lowercase, custom separators)." },
			{ name: "isValid(slug: string, separator?: string): boolean", desc: "Returns true if string is a valid URL slug structure." }
		],
		usage: `import { slugify } from "@sopkit/slug";

const slug = slugify("Café & Résumé!", { separator: "-" });
console.log(slug); // "cafe-resume"`
	},
	{
		id: "json",
		name: "@sopkit/json",
		description: "JSON syntax validator with line/column checks, pretty-formatting, and fast minification.",
		npmLink: "https://www.npmjs.com/package/@sopkit/json",
		githubLink: "https://github.com/SopKit/sopkit.github.io/tree/main/packages/json",
		installCmd: "npm install @sopkit/json",
		toolLink: "/json-formatter/",
		badge: "Developer Tools",
		api: [
			{ name: "validate(jsonStr: string): ValidationResult", desc: "Checks JSON validity. Returns parsed data or detailed syntax errors (line, column)." },
			{ name: "format(jsonStr: string, options?: FormatOptions): string", desc: "Formats (beautifies) a JSON string with customizable spaces." },
			{ name: "minify(jsonStr: string): string", desc: "Minifies a JSON string, stripping all whitespace." }
		],
		usage: `import { format, minify, validate } from "@sopkit/json";

const raw = '{"name":"sopkit","status":true}';
const pretty = format(raw, { space: 4 });
console.log(pretty);`
	},
	{
		id: "color",
		name: "@sopkit/color",
		description: "High-performance colorspace conversion utility for HEX, RGB, and HSL formats.",
		npmLink: "https://www.npmjs.com/package/@sopkit/color",
		githubLink: "https://github.com/SopKit/sopkit.github.io/tree/main/packages/color",
		installCmd: "npm install @sopkit/color",
		toolLink: "/color-converter/",
		badge: "Design Utility",
		api: [
			{ name: "hexToRgb(hex: string): RGB", desc: "Converts HEX color string (3 or 6 chars, with or without #) to RGB." },
			{ name: "rgbToHex(r, g, b): string", desc: "Converts RGB component values (0-255) to a HEX string." },
			{ name: "rgbToHsl(r, g, b): HSL", desc: "Converts RGB component values to HSL components." },
			{ name: "hslToRgb(h, s, l): RGB", desc: "Converts HSL component values to RGB components." }
		],
		usage: `import { hexToRgb, rgbToHex } from "@sopkit/color";

const rgb = hexToRgb("#3b82f6"); // { r: 59, g: 130, b: 246 }
const hex = rgbToHex(59, 130, 246); // "#3b82f6"`
	},
	{
		id: "validator",
		name: "@sopkit/validator",
		description: "Premium, ultra-fast validation library for email, URLs, domains, IP addresses, credit cards, and MAC addresses.",
		npmLink: "https://www.npmjs.com/package/@sopkit/validator",
		githubLink: "https://github.com/SopKit/sopkit.github.io/tree/main/packages/validator",
		installCmd: "npm install @sopkit/validator",
		toolLink: "/seotoolkit/",
		badge: "Validation",
		api: [
			{ name: "isEmail(email: string): boolean", desc: "Validates whether the string is a valid email according to RFC specifications." },
			{ name: "isUrl(url: string): boolean", desc: "Returns true if the string is a valid parseable URL link." },
			{ name: "isDomain(domain: string): boolean", desc: "Validates if the string is a valid domain structure." },
			{ name: "isIp(ip: string): boolean", desc: "Checks if the string is a valid IPv4 or IPv6 address." },
			{ name: "isMacAddress(mac: string): boolean", desc: "Validates MAC address format." },
			{ name: "isCreditCard(cardNumber: string): boolean", desc: "Validates credit cards using the Luhn checksum algorithm." }
		],
		usage: `import { isEmail, isCreditCard } from "@sopkit/validator";

isEmail("shaswatraj3@gmail.com"); // true
isCreditCard("49927398716"); // Luhn checksum check`
	},
	{
		id: "password",
		name: "@sopkit/password",
		description: "Premium, lightweight password generation and strength analysis library with shannon information entropy scoring.",
		npmLink: "https://www.npmjs.com/package/@sopkit/password",
		githubLink: "https://github.com/SopKit/sopkit.github.io/tree/main/packages/password",
		installCmd: "npm install @sopkit/password",
		toolLink: "/password-generator/",
		badge: "Security & Crypto",
		api: [
			{ name: "generate(options?: GeneratorOptions): string", desc: "Generates a secure password based on customized constraints (length, symbols, digits)." },
			{ name: "analyze(password: string): StrengthResult", desc: "Grades password strength (0-4 score), calculates bit entropy, and generates safety recommendations." }
		],
		usage: `import { generate, analyze } from "@sopkit/password";

const pass = generate({ length: 16 });
const strength = analyze(pass);
console.log(strength.label); // "strong" or "very-strong"`
	}
];

export default function PackagesPage() {
	return (
		<div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
			<main className="flex-grow">
				{/* Top Hero Header */}
				<section className="relative overflow-hidden bg-gradient-to-b from-primary/[0.03] via-transparent to-transparent py-12 md:py-20 border-b border-border/10">
					<div className="container mx-auto max-w-6xl px-4">
						<Suspense fallback={null}>
							<BreadcrumbsEnhanced suppressSchema={true} />
						</Suspense>

						<div className="mt-8 max-w-3xl">
							<span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/5 px-2.5 py-1 rounded-full">
								SopKit Developer Ecosystem
							</span>
							<h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mt-4 leading-tight">
								Reusable JavaScript & TypeScript Libraries
							</h1>
							<p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
								Exposing SopKit's core browser utility logic as lightweight, zero-dependency, strictly-typed packages. Easily integrate them into your own Node.js, frontend, or serverless workloads.
							</p>
						</div>
					</div>
				</section>

				{/* Packages Documentation Dashboard */}
				<section className="container mx-auto max-w-6xl px-4 py-12 md:py-16">
					<div className="space-y-16">
						{PACKAGES_DATA.map((pkg) => (
							<div
								key={pkg.id}
								id={pkg.id}
								className="p-6 md:p-8 rounded-3xl border border-border/40 bg-card/20 backdrop-blur-sm shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6 scroll-mt-20"
							>
								{/* Package Header */}
								<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/10 pb-6">
									<div className="space-y-2">
										<div className="flex items-center gap-3">
											<span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded">
												{pkg.badge}
											</span>
											<span className="text-xs font-semibold text-muted-foreground">
												v1.0.0
											</span>
										</div>
										<h2 className="text-xl md:text-2xl font-black text-foreground tracking-tight">
											{pkg.name}
										</h2>
										<p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
											{pkg.description}
										</p>
									</div>

									{/* External Links */}
									<div className="flex flex-wrap gap-2 pt-2 md:pt-0">
										<a
											href={pkg.npmLink}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-bold text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-200"
										>
											<Package className="h-3.5 w-3.5" />
											NPM Registry
											<ExternalLink className="h-3 w-3" />
										</a>
										<a
											href={pkg.githubLink}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-bold text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-200"
										>
											<Code2 className="h-3.5 w-3.5" />
											GitHub Source
											<ExternalLink className="h-3 w-3" />
										</a>
										{pkg.toolLink && (
											<Link
												href={pkg.toolLink}
												className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-1.5 text-xs font-bold hover:opacity-90 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.1)]"
											>
												Use Online Tool
												<ArrowRight className="h-3 w-3" />
											</Link>
										)}
									</div>
								</div>

								{/* Package Documentation Tabs */}
								<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
									{/* Installation & Quick Start */}
									<div className="space-y-4">
										<div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
											<Terminal className="h-4 w-4 text-primary" />
											<span>Installation</span>
										</div>
										<pre className="p-4 rounded-2xl border border-border/40 bg-muted/40 font-mono text-xs overflow-x-auto text-foreground leading-relaxed">
											{pkg.installCmd}
										</pre>

										<div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground pt-4">
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
											{pkg.api.map((method, idx) => (
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
							</div>
						))}
					</div>
				</section>
			</main>
		</div>
	);
}
