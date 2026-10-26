import { getAllToolsByCategory, Tool } from "@/lib/tools";
import { PRIVACY_HUB_GROUPS } from "@/data/privacy-hub-groups";
import { PremiumHero } from "@/components/marketing/PremiumHero";
import { GridPattern } from "@/components/shared/GridPattern";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { SITE_URL } from "@/constants/config";

// Literal metadata (online-tools precedent): this hub is not a registry
// tool, so there is no registry title or description to fall back on,
// and the values below are checked by scripts/validate-page-metadata.ts
// (title ≤60, description 100–160, including the OG/Twitter copies).
// Robots are index: true, follow: true: unlike the YouTube hub, no
// monetization rule marks the privacy-tools category risky, so the hub
// is listed in both sitemaps. The hub itself checks nothing and stores
// nothing; several of the listed tools look up public information from
// outside services, so the copy below does not claim blanket
// client-side processing — each tool page states its own model.
export const metadata = {
	title: "Free Privacy & Security Tools | SopKit",
	description:
		"Browse 23 free privacy and security helpers: check links, headers and certificates, test email deliverability, and generate consent and compliance documents.",
	keywords:
		"privacy tools, security tools, phishing url checker, ssl certificate checker, password strength checker, email validator, gdpr compliance checker, cookie consent generator, pii scrubber, ai text detector",
	alternates: {
		canonical: `${SITE_URL}/privacy-tools`,
	},
	openGraph: {
		title: "Free Privacy & Security Tools | SopKit",
		description:
			"Browse 23 free privacy and security helpers: check links, headers and certificates, test email deliverability, and generate consent and compliance documents.",
		url: `${SITE_URL}/privacy-tools`,
		siteName: "SopKit",
		images: [
			{
				url: "/og-image.jpg",
				width: 1200,
				height: 630,
				alt: "Free Privacy & Security Tools",
			},
		],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Privacy & Security Tools | SopKit",
		description:
			"Browse 23 free privacy and security helpers: check links, headers and certificates, test email deliverability, and generate consent and compliance documents.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function PrivacyHub() {
	const tools = getAllToolsByCategory("privacy-tools");
	const byId = new Map(tools.map((tool) => [tool.id, tool]));

	return (
		<div className="min-h-screen bg-background">
			<PremiumHero
				title="Privacy & Security Tools — Free Checks & Generators"
				subtitle="Browse 23 free privacy and security helpers for checks, email safety and compliance documents. Each tool page explains its own processing model."
			/>

			<div className="container mx-auto px-4 py-16 max-w-7xl relative">
				<GridPattern className="opacity-10" />

				{PRIVACY_HUB_GROUPS.map((group) => {
					const groupTools = group.toolIds
						.map((id) => byId.get(id))
						.filter((tool): tool is Tool => Boolean(tool));
					if (groupTools.length === 0) return null;
					return (
						<section key={group.heading} className="mb-16 relative z-10">
							<h2 className="text-2xl font-bold tracking-tight mb-2">
								{group.heading}
							</h2>
							<p className="text-sm text-muted-foreground leading-relaxed mb-6">
								{group.blurb}
							</p>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
								{groupTools.map((tool: Tool) => (
									<Link key={tool.id} href={tool.route}>
										<Card className="h-full border border-border/80 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all duration-200 group overflow-hidden bg-card/60 backdrop-blur-sm">
											<CardHeader className="pb-2">
												<CardTitle className="flex items-center justify-between">
													<span className="text-xl font-bold tracking-tight flex items-center gap-2">
														<ShieldCheck className="w-5 h-5 text-primary" />
														{tool.name}
													</span>
													<ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
												</CardTitle>
											</CardHeader>
											<CardContent>
												<p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
													{tool.description}
												</p>
											</CardContent>
										</Card>
									</Link>
								))}
							</div>
						</section>
					);
				})}

				{/* Rich SEO Content */}
				<section className="mt-20 max-w-4xl mx-auto space-y-8">
					<div className="p-8 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm">
						<h2 className="text-2xl font-bold tracking-tight mb-4">Free Online Privacy & Security Tools — Checks, Email Safety & Compliance</h2>
						<p className="text-sm text-muted-foreground leading-relaxed mb-4">
							SopKit&apos;s privacy shelf gathers 23 free helpers in one place: detectors and checkers for links, domains, headers and certificates, email validation and deliverability tests, and generators for consent banners, policies and breach paperwork. Start from the group you need and open the tool — each tool page carries its own description, steps and limits.
						</p>
						<p className="text-sm text-muted-foreground leading-relaxed mb-4">
							Some of these tools look up public information — a domain, a certificate or a breach record — so they necessarily touch an outside service, while others work on text you paste in. Each tool page states its own processing model; read it before pasting anything, and never paste passwords, credentials or private personal data into a checker.
						</p>
						<p className="text-sm text-muted-foreground leading-relaxed">
							The hub itself lists tools only; it does not check, generate or store anything. It is free to browse with no account needed.
						</p>
					</div>
				</section>
			</div>
		</div>
	);
}
