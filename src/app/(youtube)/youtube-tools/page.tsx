import { getAllToolsByCategory, Tool } from "@/lib/tools";
import { YOUTUBE_HUB_GROUPS } from "@/data/youtube-hub-groups";
import { PremiumHero } from "@/components/marketing/PremiumHero";
import { GridPattern } from "@/components/shared/GridPattern";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Youtube, ArrowRight } from "lucide-react";
import { SITE_URL } from "@/constants/config";

// Literal metadata (online-tools precedent), not the shared tool-metadata
// generator: the generated fallback title for a non-registry route
// ("Process & Export Files") is wrong for this hub, and the literal values
// below are checked by scripts/validate-page-metadata.ts (title ≤60,
// description 100–160). Robots are deliberately noindex: every tool in this
// category is noindex under the monetization decision (risky category), so
// an indexed hub would funnel search traffic to copyright-sensitive
// downloader pages. The hub is a navigation page for people, not a
// landing page for crawlers, and it is therefore NOT listed in either
// sitemap. follow: true keeps it usable as a navigation page.
export const metadata = {
	title: "Free YouTube Tools — Downloads, Channels & Tags | SopKit",
	description:
		"Browse 31 free YouTube helpers for downloads, channel research, titles, tags and descriptions. Each tool page explains its own processing model.",
	keywords:
		"youtube tools, youtube downloader, youtube shorts downloader, youtube thumbnail downloader, youtube tag generator, youtube title generator, youtube channel statistics, youtube embed generator, creator tools",
	alternates: {
		canonical: `${SITE_URL}/youtube-tools`,
	},
	openGraph: {
		title: "Free YouTube Tools — Downloads, Channels & Tags | SopKit",
		description:
			"Browse 31 free YouTube helpers for downloads, channel research, titles, tags and descriptions. Each tool page explains its own processing model.",
		url: `${SITE_URL}/youtube-tools`,
		siteName: "SopKit",
		images: [
			{
				url: "/og-image.jpg",
				width: 1200,
				height: 630,
				alt: "Free YouTube Tools",
			},
		],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free YouTube Tools — Downloads, Channels & Tags | SopKit",
		description:
			"Browse 31 free YouTube helpers for downloads, channel research, titles, tags and descriptions. Each tool page explains its own processing model.",
		images: ["/og-image.jpg"],
	},
	robots: { index: false, follow: true },
};

export default function YouTubeHub() {
	const tools = getAllToolsByCategory("youtube");
	const byId = new Map(tools.map((tool) => [tool.id, tool]));

	return (
		<div className="min-h-screen bg-background">
			<PremiumHero
				title="YouTube Tools — Free Creator Utilities"
				subtitle="Browse 31 free YouTube helpers for downloads, channel research, titles, tags and links. Each tool page explains its own processing model."
			/>

			<div className="container mx-auto px-4 py-16 max-w-7xl relative">
				<GridPattern className="opacity-10" />

				{YOUTUBE_HUB_GROUPS.map((group) => {
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
														<Youtube className="w-5 h-5 text-primary" />
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
						<h2 className="text-2xl font-bold tracking-tight mb-4">Free Online YouTube Tools — Downloads, Channel Research & Creator Writing</h2>
						<p className="text-sm text-muted-foreground leading-relaxed mb-4">
							SopKit&apos;s YouTube shelf gathers 31 free helpers in one place: downloads, channel research, title and tag writing, and link building. Start from the group you need and open the tool — each tool page carries its own description, steps and limits.
						</p>
						<p className="text-sm text-muted-foreground leading-relaxed mb-4">
							Downloads and channel lookups work with public YouTube links and channel identifiers; title, tag and description tools work from text you paste in. Because these tools touch an outside platform, each tool page states its own processing model — read it before pasting a link, and never paste credentials or private URLs.
						</p>
						<p className="text-sm text-muted-foreground leading-relaxed">
							The hub itself lists tools only; it does not download, convert or store anything. It is free to browse with no account needed.
						</p>
					</div>
				</section>
			</div>
		</div>
	);
}
