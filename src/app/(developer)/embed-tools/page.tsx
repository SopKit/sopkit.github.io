import { SITE_URL } from "@/constants/config";
import Link from "next/link";
import { ArrowRight, Code2 } from "lucide-react";
import { GridPattern } from "@/components/shared/GridPattern";
import CopySnippet from "./CopySnippet";

export const metadata = {
	title: "Embed Free Tools on Your Website — Iframe Widgets | SopKit",
	description:
		"Copy-paste iframe widgets for QR codes, password generation, JSON formatting and more. Free, sandboxed, themeable embeds — no backend or signup required.",
	keywords:
		"embed widgets, add free tools to your website, iframe widgets, embed tools, website tools widget, qr code embed, json formatter embed, free website widgets",
	alternates: {
		canonical: `${SITE_URL}/embed-tools`,
	},
	openGraph: {
		title: "Embed Free Tools on Your Website — Iframe Widgets | SopKit",
		description:
			"Copy-paste iframe widgets for QR codes, password generation, JSON formatting and more. Free, sandboxed, themeable embeds — no backend or signup required.",
		url: `${SITE_URL}/embed-tools`,
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Embed Free Tools on Your Website — Iframe Widgets | SopKit",
		description:
			"Copy-paste iframe widgets for QR codes, password generation, JSON formatting and more. Free, sandboxed, themeable embeds — no backend or signup required.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

const EMBED_BASE = `${SITE_URL}/embed-tool/`;

interface EmbeddableTool {
	id: string;
	name: string;
	description: string;
}

const EMBEDDABLE_TOOLS: EmbeddableTool[] = [
	{ id: "qr-code-generator", name: "QR Code Generator", description: "Create scannable QR codes for URLs, Wi-Fi, contact details, and plain text." },
	{ id: "password-generator", name: "Password Generator", description: "Generate cryptographically secure random passwords with custom length and symbols." },
	{ id: "json-formatter", name: "JSON Formatter", description: "Beautify, validate, and minify JSON data with instant syntax highlighting." },
	{ id: "word-counter", name: "Word Counter", description: "Count words, characters, sentences, and paragraphs in any block of text." },
	{ id: "case-converter", name: "Case Converter", description: "Switch text between UPPERCASE, lowercase, Sentence case, and Title Case." },
	{ id: "uuid-generator", name: "UUID/GUID Generator", description: "Generate unique UUID v4 identifiers for databases, APIs, and testing." },
	{ id: "length-converter", name: "Length Converter", description: "Convert between meters, feet, inches, miles, kilometers, and more." },
	{ id: "temperature-converter", name: "Temperature Converter", description: "Convert between Celsius, Fahrenheit, Kelvin, and Rankine instantly." },
	{ id: "rgb-to-hex-converter", name: "RGB to HEX Converter", description: "Translate RGB color values into HEX codes for CSS and design work." },
	{ id: "color-converter", name: "Color Converter", description: "Transform color codes between HEX, RGB, HSL, and CMYK formats." },
	{ id: "markdown-to-html", name: "Markdown to HTML Converter", description: "Turn Markdown into clean HTML markup for blogs, docs, and newsletters." },
	{ id: "base64-encode", name: "Base64 Encode", description: "Encode plain text into Base64 strings for tokens, data URIs, and APIs." },
];

function buildSnippet(toolId: string, theme: string = "light"): string {
	return `<iframe src="${EMBED_BASE}?id=${toolId}&theme=${theme}" width="100%" height="600" frameborder="0" loading="lazy"></iframe>`;
}

const PARAM_DOCS = [
	{ param: "id", values: "any tool ID", description: "Which tool to load, e.g. qr-code-generator. See the gallery above for verified IDs." },
	{ param: "theme", values: "light | dark", description: "Color scheme of the embedded tool. Defaults to dark if omitted." },
	{ param: "accent", values: "blue | purple | emerald | orange", description: "Accent color applied to buttons and highlights. Defaults to blue." },
];

function EmbedCard({ tool }: { tool: EmbeddableTool }) {
	const snippet = buildSnippet(tool.id);
	return (
		<article className="rounded-2xl border border-border/60 bg-card/50 p-6 space-y-4">
			<div>
				<h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
					<Code2 className="h-4 w-4 text-primary shrink-0" />
					{tool.name}
				</h3>
				<p className="mt-1 text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
			</div>
			<div className="relative">
				<pre className="overflow-x-auto rounded-xl border border-border/60 bg-background/80 p-4 pr-16 text-xs leading-relaxed">
					<code>{snippet}</code>
				</pre>
				<CopySnippet snippet={snippet} />
			</div>
			<details className="group rounded-xl border border-border/60 bg-background/60">
				<summary className="cursor-pointer select-none px-4 py-2.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
					Live preview
				</summary>
				<div className="px-4 pb-4">
					<iframe
						src={`${EMBED_BASE}?id=${tool.id}&theme=light`}
						width="100%"
						height="500"
						frameBorder={0}
						title={`${tool.name} embedded preview`}
						loading="lazy"
						className="rounded-lg border border-border/40 bg-background w-full"
					/>
				</div>
			</details>
		</article>
	);
}

export default function EmbedToolsPage() {
	return (
		<div className="min-h-screen bg-background selection:bg-primary/10">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "CollectionPage",
						name: "Embed Free Tools on Your Website",
						description:
							"Copy-paste iframe widgets for 12 popular SopKit tools. Free, sandboxed, themeable embeds with no backend required.",
						url: `${SITE_URL}/embed-tools`,
						isAccessibleForFree: true,
					}),
				}}
			/>
			<main>
				<header className="relative border-b border-border/40 overflow-hidden">
					<GridPattern className="opacity-10" />
					<div className="container mx-auto px-4 py-16 md:py-20 max-w-7xl relative z-10">
						<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Embed Free Tools on Your Website</h1>
						<p className="mt-4 max-w-3xl text-base md:text-lg text-muted-foreground leading-relaxed">
							Add a working calculator, converter, or generator to any page with a single iframe snippet.
							Every widget is completely free, needs no backend on your side, and runs inside a sandboxed
							iframe so it can never break your layout.
						</p>
						<ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl">
							{[
								["100% free", "No usage caps, no watermark, no attribution required."],
								["No backend needed", "One static snippet works on WordPress, Ghost, Hugo, or plain HTML."],
								["Sandboxed iframe", "The widget is isolated from your page's scripts and styles."],
								["Theme & accent options", "Match light/dark mode and pick from four accent colors."],
							].map(([title, body]) => (
								<li key={title} className="rounded-xl border border-border/60 bg-card/50 p-4">
									<p className="text-sm font-bold">{title}</p>
									<p className="mt-1 text-xs text-muted-foreground leading-relaxed">{body}</p>
								</li>
							))}
						</ul>
					</div>
				</header>

				<div className="container mx-auto px-4 py-14 max-w-7xl space-y-14">
					<section className="space-y-6">
						<h2 className="text-2xl font-bold tracking-tight">Ready-made embed snippets</h2>
						<p className="text-sm text-muted-foreground max-w-3xl">
							Copy the snippet, paste it into your page's HTML, and the tool just works. Open{" "}
							<span className="font-semibold text-foreground">Live preview</span> to try each widget before embedding.
						</p>
						<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
							{EMBEDDABLE_TOOLS.map((tool) => (
								<EmbedCard key={tool.id} tool={tool} />
							))}
						</div>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-bold tracking-tight">URL parameters</h2>
						<div className="overflow-x-auto rounded-2xl border border-border/60">
							<table className="w-full text-sm">
								<thead>
									<tr className="border-b border-border/60 bg-card/60 text-left">
										<th className="px-4 py-3 font-semibold">Parameter</th>
										<th className="px-4 py-3 font-semibold">Values</th>
										<th className="px-4 py-3 font-semibold">Description</th>
									</tr>
								</thead>
								<tbody>
									{PARAM_DOCS.map((row) => (
										<tr key={row.param} className="border-b border-border/30 last:border-0">
											<td className="px-4 py-3 font-mono text-xs font-bold text-primary">{row.param}</td>
											<td className="px-4 py-3 font-mono text-xs text-muted-foreground">{row.values}</td>
											<td className="px-4 py-3 text-muted-foreground">{row.description}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
							<strong className="text-foreground">Framing policy:</strong> all <code className="font-mono text-xs">/embed-tool/*</code>{" "}
							routes send <code className="font-mono text-xs">X-Frame-Options: ALLOWALL</code>, so browsers will never block these
							widgets when embedded on your domain. Regular SopKit pages stay protected against clickjacking.
						</p>
					</section>

					<section className="rounded-2xl border border-border/60 bg-card/40 p-8 md:p-10">
						<h2 className="text-2xl font-bold tracking-tight">Need a different tool?</h2>
						<p className="mt-3 max-w-3xl text-sm md:text-base text-muted-foreground leading-relaxed">
							Any tool ID from our library works with the same URL pattern. Browse everything on the{" "}
							<Link href="/online-tools" className="font-semibold text-primary hover:text-primary/80 inline-flex items-center gap-1 transition-colors">
								online tools hub
								<ArrowRight className="h-3.5 w-3.5" />
							</Link>{" "}
							and swap the <code className="font-mono text-xs">id</code> parameter.
						</p>
					</section>
				</div>
			</main>
		</div>
	);
}
