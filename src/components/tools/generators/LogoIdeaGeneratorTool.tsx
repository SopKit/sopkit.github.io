"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
	ToolShell,
	ToolGrid,
	ToolGridMain,
	ToolGridSide,
	ToolPanel,
	ToolSectionTitle,
	ToolField,
} from "@/components/tools/shared/design-system";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Sparkles, Copy, Download, RefreshCw, Palette, Type, Compass, Check, Layers } from "lucide-react";

type Industry = "tech" | "coffee" | "fitness" | "luxury" | "finance" | "eco" | "gaming" | "creative";
type Personality = "minimalist" | "luxury" | "playful" | "bold" | "vintage" | "cyber";

interface LogoConcept {
	id: string;
	title: string;
	category: string;
	styleType: "Monogram" | "Abstract Emblem" | "Combination Mark" | "Dynamic Wordmark";
	description: string;
	iconConcept: string;
	colors: { hex: string; name: string }[];
	typography: { heading: string; body: string; notes: string };
	aiPrompt: string;
}

const INDUSTRY_PRESETS: Record<Industry, { keywords: string[]; symbolTypes: string[] }> = {
	tech: { keywords: ["latency", "nodes", "flow", "cloud", "stack", "velocity", "core"], symbolTypes: ["geometric nodes", "layered circuits", "dynamic infinity loop", "angular monogram"] },
	coffee: { keywords: ["roast", "aroma", "steam", "grain", "artisan", "haven", "brew"], symbolTypes: ["steam ribbon silhouette", "abstract botanical seed", "minimalist ceramic mug contour", "vintage seal"] },
	fitness: { keywords: ["kinetic", "pulse", "stamina", "apex", "forge", "titan", "momentum"], symbolTypes: ["forward-leaning chevron", "lightning pulse", "bold interlocking geometric ring", "dynamic shield"] },
	luxury: { keywords: ["heritage", "opulence", "prestige", "aurum", "velvet", "sovereign", "atelier"], symbolTypes: ["slender serif crest", "interlocked dual monograms", "astronomical geometry", "golden ratio seal"] },
	finance: { keywords: ["vault", "yield", "capital", "ledger", "apex", "horizon", "anchor"], symbolTypes: ["ascending isometric pillar", "security crest with negative space checkmark", "solid structural hexagon", "geometric delta"] },
	eco: { keywords: ["botanical", "bioma", "verdant", "terra", "canopy", "sol", "sprout"], symbolTypes: ["intertwined continuous-line leaf", "solar radiating circle", "droplet converging into petal", "organic spiral"] },
	gaming: { keywords: ["pixel", "glitch", "vortex", "nexus", "respawn", "cyber", "hyper"], symbolTypes: ["isometric sharp polygon", "mecha helmet crest", "neon glowing rune", "cybernetic stylized beast"] },
	creative: { keywords: ["prism", "chroma", "canvas", "muse", "studio", "spark", "form"], symbolTypes: ["overlapping CMYK aperture", "kaleidoscopic geometry", "fluid brushstroke monogram", "origami facet"] },
};

const COLOR_PALETTES = [
	{ name: "Oceanic Cyan & Slate", colors: [{ hex: "#0F172A", name: "Deep Navy" }, { hex: "#0284C7", name: "Sky Cyan" }, { hex: "#F8FAFC", name: "Frost White" }] },
	{ name: "Sunset Terracotta", colors: [{ hex: "#9A3412", name: "Terracotta" }, { hex: "#F59E0B", name: "Amber Ochre" }, { hex: "#FFFBEB", name: "Warm Cream" }] },
	{ name: "Emerald Forest", colors: [{ hex: "#064E3B", name: "Deep Pine" }, { hex: "#10B981", name: "Vibrant Mint" }, { hex: "#ECFDF5", name: "Soft Sage" }] },
	{ name: "Luxury Champagne & Obsidian", colors: [{ hex: "#18181B", name: "Obsidian" }, { hex: "#D4AF37", name: "Metallic Gold" }, { hex: "#FAF9F6", name: "Alabaster" }] },
	{ name: "Neon Cyberpunk", colors: [{ hex: "#09090B", name: "Pitch Black" }, { hex: "#EC4899", name: "Neon Pink" }, { hex: "#8B5CF6", name: "Electric Violet" }] },
	{ name: "Nordic Minimalist Monochrome", colors: [{ hex: "#111827", name: "Carbon" }, { hex: "#6B7280", name: "Pewter Grey" }, { hex: "#FFFFFF", name: "Pure White" }] },
];

export default function LogoIdeaGeneratorTool() {
	const [brandName, setBrandName] = useState<string>("Veloce");
	const [tagline, setTagline] = useState<string>("Instant Developer Productivity");
	const [industry, setIndustry] = useState<Industry>("tech");
	const [personality, setPersonality] = useState<Personality>("minimalist");
	const [results, setResults] = useState<LogoConcept[]>([]);
	const [copiedId, setCopiedId] = useState<string | null>(null);

	const generateConcepts = useCallback(() => {
		const name = brandName.trim() || "Brand";
		const initial = name.charAt(0).toUpperCase();
		const secondChar = name.length > 1 ? name.charAt(1).toUpperCase() : "X";
		const indData = INDUSTRY_PRESETS[industry] || INDUSTRY_PRESETS.tech;

		const concepts: LogoConcept[] = [
			{
				id: "concept-1",
				title: "Geometric Modern Monogram",
				category: "Minimalist Identity",
				styleType: "Monogram",
				description: `Constructed around a crisp silhouette of the letter "${initial}". Uses negative space and architectural precision to communicate authority and digital sophistication.`,
				iconConcept: `A stylized uppercase "${initial}" formed by two intersecting vector bars, with a 45-degree angle in the upper terminal to evoke rapid motion.`,
				colors: COLOR_PALETTES[0].colors,
				typography: {
					heading: "Clash Display or Syne (Semibold)",
					body: "Plus Jakarta Sans (Regular)",
					notes: "Generous letter spacing (+1.5px) with wide uppercase wordmark tracking.",
				},
				aiPrompt: `Vector logo for a ${industry} brand named "${name}", geometric monogram letter "${initial}", negative space, minimalist, clean lines, flat colors #0F172A and #0284C7, white background, Dribbble trending, behance branding --no gradients, 3d, realistic photo`,
			},
			{
				id: "concept-2",
				title: "Dynamic Abstract Emblem",
				category: "Progressive & Scalable",
				styleType: "Abstract Emblem",
				description: `A fluid yet structured badge combining ${indData.symbolTypes[0]} with modern optical illusion facets, ideal for app icons, favicons, and hardware stamping.`,
				iconConcept: `Three concentric curved petals converging into an inward focal point, suggesting collaboration, focus, and exponential acceleration.`,
				colors: COLOR_PALETTES[2].colors,
				typography: {
					heading: "Cabinet Grotesk or Satoshi (Bold)",
					body: "Inter (Medium)",
					notes: "Tight tracking (-0.5px) for a confident, unified tech-startup aesthetic.",
				},
				aiPrompt: `Modern logo mark for "${name}", ${indData.symbolTypes[0]}, abstract geometric emblem, simple flat vector, color palette #064E3B and #10B981, crisp icon design, corporate identity, high contrast --no shadows, complex details`,
			},
			{
				id: "concept-3",
				title: "Artisanal Combination Mark",
				category: "Humanist & Organic",
				styleType: "Combination Mark",
				description: `Merges tactile organic warmth with high-end editorial flair. Combines a distinctive line-art symbol with a refined logotype.`,
				iconConcept: `An unbroken continuous mono-line contour illustrating ${indData.symbolTypes[1]} nestled above the company title.`,
				colors: COLOR_PALETTES[1].colors,
				typography: {
					heading: "Playfair Display or Cormorant Garamond",
					body: "DM Sans (Regular)",
					notes: "Classic high-contrast editorial serif paired with a clean geometric sans-serif subtitle.",
				},
				aiPrompt: `Minimalist line-art combination mark logo for "${name}", ${indData.symbolTypes[1]}, warm earthy terracotta #9A3412 and amber #F59E0B, modern luxury editorial style, vector logo on clean ivory backdrop`,
			},
			{
				id: "concept-4",
				title: "Bold Architectural Wordmark",
				category: "High Impact & Direct",
				styleType: "Dynamic Wordmark",
				description: `Custom typographic logotype where the letter "${initial}" or terminal letters receive bespoke diagonal cuts and bespoke kerning modifications.`,
				iconConcept: `Pure typography where the glyphs of "${name}" interlock seamlessly without need for an external badge or mascot.`,
				colors: COLOR_PALETTES[3].colors,
				typography: {
					heading: "Outfit or Monument Extended (Extra Bold)",
					body: "Geist Sans (Light)",
					notes: "All-caps presentation with customized ligatures connecting vowels.",
				},
				aiPrompt: `Typographic wordmark logo for "${name}", bold brutalist modern lettering, luxury gold and obsidian, sharp clean angles, visual identity system, trademark design, vector illustration`,
			},
		];

		setResults(concepts);
		toast.success(`Generated 4 branding concepts for ${name}!`);
	}, [brandName, industry]);

	// Auto generate on initial render
	React.useEffect(() => {
		generateConcepts();
	}, []);

	const copyToClipboard = (text: string, id: string, label: string) => {
		navigator.clipboard.writeText(text);
		setCopiedId(id);
		toast.success(`Copied ${label}!`);
		setTimeout(() => setCopiedId(null), 2000);
	};

	const exportBrief = () => {
		if (results.length === 0) return;
		const name = brandName || "Brand";
		let doc = `# Creative Logo & Identity Brief: ${name}\n`;
		if (tagline) doc += `**Tagline:** ${tagline}\n`;
		doc += `**Industry:** ${industry.toUpperCase()} | **Personality:** ${personality.toUpperCase()}\n\n`;

		results.forEach((c, idx) => {
			doc += `## Concept ${idx + 1}: ${c.title} (${c.styleType})\n`;
			doc += `**Rationale:** ${c.description}\n`;
			doc += `**Icon Architecture:** ${c.iconConcept}\n`;
			doc += `**Palette:** ${c.colors.map((col) => `${col.name} (${col.hex})`).join(", ")}\n`;
			doc += `**Typography Pairing:** Heading: ${c.typography.heading} | Body: ${c.typography.body} (${c.typography.notes})\n`;
			doc += `**AI Vector Prompt:** \`${c.aiPrompt}\`\n\n---\n\n`;
		});

		const blob = new Blob([doc], { type: "text/markdown;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-logo-brief.md`;
		link.click();
		URL.revokeObjectURL(url);
		toast.success(`Exported ${link.download}`);
	};

	return (
		<ToolShell>
			<ToolGrid>
				{/* Settings Controls */}
				<ToolGridMain>
					<ToolPanel>
						<ToolSectionTitle
							title="Brand Parameters & Style Matrix"
							description="Enter your brand identity details to explore conceptual logo directions."
						/>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
							<ToolField label="Brand / Project Name">
								<Input
									value={brandName}
									onChange={(e) => setBrandName(e.target.value)}
									placeholder="e.g. Veloce, Bloom, Solaria"
								/>
							</ToolField>

							<ToolField label="Slogan / Tagline (Optional)">
								<Input
									value={tagline}
									onChange={(e) => setTagline(e.target.value)}
									placeholder="e.g. Pure Coffee Craft"
								/>
							</ToolField>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
							<ToolField label="Market Sector / Industry">
								<Select value={industry} onValueChange={(val: Industry) => setIndustry(val)}>
									<SelectTrigger>
										<SelectValue placeholder="Industry" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="tech">Technology, SaaS & Software</SelectItem>
										<SelectItem value="coffee">Coffee, Bakery & Food Craft</SelectItem>
										<SelectItem value="fitness">Fitness, Athletics & Wellness</SelectItem>
										<SelectItem value="luxury">Luxury, Fashion & Jewelry</SelectItem>
										<SelectItem value="finance">Finance, Fintech & Venture</SelectItem>
										<SelectItem value="eco">Sustainability, Nature & Eco</SelectItem>
										<SelectItem value="gaming">Gaming, Esports & Streaming</SelectItem>
										<SelectItem value="creative">Creative Studio, Media & Design</SelectItem>
									</SelectContent>
								</Select>
							</ToolField>

							<ToolField label="Aesthetic Personality">
								<Select value={personality} onValueChange={(val: Personality) => setPersonality(val)}>
									<SelectTrigger>
										<SelectValue placeholder="Personality" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="minimalist">Minimalist & Clean</SelectItem>
										<SelectItem value="luxury">High-End Luxury & Editorial</SelectItem>
										<SelectItem value="bold">Bold & High Contrast</SelectItem>
										<SelectItem value="playful">Playful, Approachable & Warm</SelectItem>
										<SelectItem value="vintage">Heritage & Vintage Craft</SelectItem>
										<SelectItem value="cyber">Futuristic & Cyber Tech</SelectItem>
									</SelectContent>
								</Select>
							</ToolField>
						</div>

						<div className="mt-6 flex flex-wrap gap-3">
							<Button size="lg" onClick={generateConcepts} className="gap-2 font-semibold shadow-sm">
								<Sparkles className="h-4 w-4" /> Generate Logo Directions
							</Button>
							{results.length > 0 && (
								<Button variant="outline" size="lg" onClick={exportBrief} className="gap-2">
									<Download className="h-4 w-4" /> Export Creative Brief (.MD)
								</Button>
							)}
						</div>
					</ToolPanel>

					{/* Concept Cards Display */}
					<div className="space-y-6 mt-6">
						{results.map((c) => (
							<ToolPanel key={c.id}>
								<div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-3 border-b border-border/50">
									<div>
										<div className="flex items-center gap-2">
											<span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
												{c.styleType}
											</span>
											<span className="text-xs text-muted-foreground">{c.category}</span>
										</div>
										<h3 className="text-lg font-bold text-foreground mt-1">{c.title}</h3>
									</div>

									{/* Color Swatch Preview */}
									<div className="flex items-center gap-1.5 bg-muted/30 p-1.5 rounded-xl border border-border/50">
										{c.colors.map((col, idx) => (
											<div
												key={idx}
												title={`${col.name} (${col.hex})`}
												className="h-6 w-6 rounded-lg border border-border/80 shadow-xs"
												style={{ backgroundColor: col.hex }}
											/>
										))}
									</div>
								</div>

								{/* Rationale and Geometry */}
								<div className="my-4 space-y-2 text-sm leading-relaxed">
									<p className="text-foreground">{c.description}</p>
									<p className="text-xs text-muted-foreground bg-muted/20 p-2.5 rounded-xl border border-border/40">
										<strong>Icon Architecture:</strong> {c.iconConcept}
									</p>
								</div>

								{/* Typography Specs */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-muted/10 p-3 rounded-xl border border-border/30">
									<div>
										<p className="font-semibold text-foreground flex items-center gap-1">
											<Type className="h-3.5 w-3.5 text-primary" /> Font Pairing:
										</p>
										<p className="text-muted-foreground mt-0.5">
											{c.typography.heading} + {c.typography.body}
										</p>
									</div>
									<div>
										<p className="font-semibold text-foreground">Kerning & Tracking:</p>
										<p className="text-muted-foreground mt-0.5">{c.typography.notes}</p>
									</div>
								</div>

								{/* AI Prompt Box */}
								<div className="mt-4 pt-3 border-t border-border/40">
									<div className="flex items-center justify-between mb-1.5">
										<span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
											<Sparkles className="h-3 w-3 text-primary" /> AI Generator Prompt (Midjourney / DALL-E)
										</span>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => copyToClipboard(c.aiPrompt, `${c.id}-prompt`, "AI Prompt")}
											className="h-7 text-xs gap-1"
										>
											{copiedId === `${c.id}-prompt` ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
											Copy Prompt
										</Button>
									</div>
									<code className="block p-2.5 rounded-lg bg-muted/40 font-mono text-xs text-foreground/90 overflow-x-auto select-all">
										{c.aiPrompt}
									</code>
								</div>
							</ToolPanel>
						))}
					</div>
				</ToolGridMain>

				{/* Sidebar Design Framework */}
				<ToolGridSide>
					<ToolPanel>
						<ToolSectionTitle
							title="Logomark Archetypes"
							description="Understanding the core brand symbol styles."
						/>
						<div className="space-y-3 mt-4 text-xs text-muted-foreground leading-relaxed">
							<div className="p-2.5 rounded-xl bg-muted/30 border border-border/40">
								<p className="font-semibold text-foreground">1. Monogram / Lettermark</p>
								<p className="mt-0.5">
									Condenses brand initials into an identifiable geometric seal. Excellent for mobile favicons and app store icons (e.g., IBM, HP, Airbnb).
								</p>
							</div>

							<div className="p-2.5 rounded-xl bg-muted/30 border border-border/40">
								<p className="font-semibold text-foreground">2. Abstract Emblem</p>
								<p className="mt-0.5">
									Conveys conceptual values (speed, growth, security) through non-literal geometry rather than literal pictures (e.g., Nike Swoosh, Pepsi).
								</p>
							</div>

							<div className="p-2.5 rounded-xl bg-muted/30 border border-border/40">
								<p className="font-semibold text-foreground">3. Wordmark / Logotype</p>
								<p className="mt-0.5">
									A typographic presentation of the full company name using custom kerning and bespoke ligatures (e.g., Google, Sony, Visa).
								</p>
							</div>
						</div>
					</ToolPanel>

					<ToolPanel className="mt-6">
						<div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
							<h3 className="font-semibold text-foreground text-sm flex items-center gap-1.5">
								<Palette className="h-4 w-4 text-primary" />
								Color Psychology Matrix
							</h3>
							<p>
								<strong>Deep Navy &amp; Cyan:</strong> Universally communicates digital trust, high uptime, and enterprise engineering stability.
							</p>
							<p>
								<strong>Emerald Pine:</strong> Associated with sustainability, organic wellness, wealth management, and freshness.
							</p>
							<p>
								<strong>Obsidian &amp; Gold:</strong> Signals uncompromising quality, editorial sophistication, and scarcity.
							</p>
						</div>
					</ToolPanel>
				</ToolGridSide>
			</ToolGrid>
		</ToolShell>
	);
}
