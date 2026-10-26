import { getAllToolsByCategory, Tool } from "@/lib/tools";
import { HEALTH_HUB_GROUPS } from "@/data/health-hub-groups";
import { PremiumHero } from "@/components/marketing/PremiumHero";
import { GridPattern } from "@/components/shared/GridPattern";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartPulse, ArrowRight } from "lucide-react";
import { SITE_URL } from "@/constants/config";

// Literal metadata (online-tools precedent): this hub is not a registry
// tool, so there is no registry title or description to fall back on,
// and the values below are checked by scripts/validate-page-metadata.ts
// (title ≤60, description 100–160, including the OG/Twitter copies).
// Robots are index: true, follow: true: no monetization rule marks
// the health category risky, so the hub is listed in both sitemaps.
// The hub gives no health advice itself: the calculators estimate
// from the numbers entered, and each tool page states its own inputs
// and limits. The copy below says exactly that and nothing more.
export const metadata = {
	title: "Free Health & Fitness Calculators | SopKit",
	description:
		"Browse 5 free health calculators: estimate BMR, daily calorie needs, macros, ideal body weight and body fat percentage from your own measurements.",
	keywords:
		"health calculators, bmr calculator, tdee calculator, macro calculator, ideal body weight calculator, body fat calculator, calorie needs calculator",
	alternates: {
		canonical: `${SITE_URL}/health`,
	},
	openGraph: {
		title: "Free Health & Fitness Calculators | SopKit",
		description:
			"Browse 5 free health calculators: estimate BMR, daily calorie needs, macros, ideal body weight and body fat percentage from your own measurements.",
		url: `${SITE_URL}/health`,
		siteName: "SopKit",
		images: [
			{
				url: "/og-image.jpg",
				width: 1200,
				height: 630,
				alt: "Free Health & Fitness Calculators",
			},
		],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Health & Fitness Calculators | SopKit",
		description:
			"Browse 5 free health calculators: estimate BMR, daily calorie needs, macros, ideal body weight and body fat percentage from your own measurements.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function HealthHub() {
	const tools = getAllToolsByCategory("health");
	const byId = new Map(tools.map((tool) => [tool.id, tool]));

	return (
		<div className="min-h-screen bg-background">
			<PremiumHero
				title="Health & Fitness Calculators — Free Estimates"
				subtitle="Browse 5 free health calculators for metabolic rate, calorie needs, macros, ideal weight and body fat. Each tool page explains its own inputs and limits."
			/>

			<div className="container mx-auto px-4 py-16 max-w-7xl relative">
				<GridPattern className="opacity-10" />

				{HEALTH_HUB_GROUPS.map((group) => {
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
														<HeartPulse className="w-5 h-5 text-primary" />
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
						<h2 className="text-2xl font-bold tracking-tight mb-4">Free Online Health Calculators — BMR, Calories, Macros & Body Fat</h2>
						<p className="text-sm text-muted-foreground leading-relaxed mb-4">
							SopKit&apos;s health shelf gathers 5 free calculators in one place: basal metabolic rate, total daily energy expenditure, macronutrient splits, ideal body weight and body fat percentage. Start from the calculator you need and open the tool — each tool page carries its own description, inputs and limits.
						</p>
						<p className="text-sm text-muted-foreground leading-relaxed mb-4">
							These calculators give estimates from the numbers you enter; they are not medical advice and do not replace professional guidance. Results depend on the accuracy of the measurements entered, so check the inputs on each tool page before relying on an estimate.
						</p>
						<p className="text-sm text-muted-foreground leading-relaxed">
							The hub itself lists tools only; it does not calculate or store anything. It is free to browse with no account needed.
						</p>
					</div>
				</section>
			</div>
		</div>
	);
}
