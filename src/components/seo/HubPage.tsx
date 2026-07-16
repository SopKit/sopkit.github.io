import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StructuredData from "@/components/shared/StructuredData";
import BreadcrumbsEnhanced from "@/components/seo/BreadcrumbsEnhanced";
import { getAllTools, type Tool } from "@/lib/tools";
import { SITE_CONFIG } from "@/constants/config";

export type HubPageProps = {
	title: string;
	description: string;
	route: string;
	tools: Tool[];
	guideTitle?: string;
	guidePoints?: string[];
	faqs?: { question: string; answer: string }[];
	badge?: string;
};

function itemListSchema(route: string, items: { route: string; name: string }[]) {
	return {
		"@context": "https://schema.org",
		"@type": "ItemList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			url: `${SITE_CONFIG.siteUrl}${item.route}`,
		})),
		url: `${SITE_CONFIG.siteUrl}${route}`,
	};
}

export default function HubPage({
	title,
	description,
	route,
	tools,
	guideTitle = "How to Get Started",
	guidePoints = [],
	faqs = [],
	badge = "Free Online Tools",
}: HubPageProps) {
	const topTools = tools.slice(0, 20);
	const schema = itemListSchema(route, topTools.map(t => ({ route: t.route, name: t.name })));

	return (
		<div className="min-h-screen bg-background text-foreground">
			<StructuredData />
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(schema).replace(/</g, "\\u003c"),
				}}
			/>
			<main className="container mx-auto max-w-6xl px-4 py-12 md:py-16 space-y-12">
				<BreadcrumbsEnhanced customBreadcrumbs={[{ name: title, url: route }]} />
				<section className="max-w-3xl space-y-5">
					<Badge variant="secondary" className="rounded-md">{badge}</Badge>
					<h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
						{title}
					</h1>
					<p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
						{description}
					</p>
					<p className="text-sm text-muted-foreground">
						All tools run 100% client-side in your browser. No uploads, no signup, no data selling.
					</p>
				</section>

				<section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{topTools.map((tool) => (
						<Link
							key={tool.id}
							href={tool.route}
							className="group rounded-md border border-border/60 bg-card/40 p-5 transition-colors hover:border-primary/30"
						>
							<div className="flex items-start justify-between gap-4">
								<div>
									<h2 className="text-lg font-bold group-hover:text-primary">
										{tool.name}
									</h2>
									<p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
										{tool.description}
									</p>
								</div>
								<ArrowRight className="mt-8 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
							</div>
						</Link>
					))}
				</section>

				{(guidePoints.length > 0 || faqs.length > 0) && (
					<section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
						{guidePoints.length > 0 && (
							<Card className="rounded-md border-border/60">
								<CardHeader>
									<CardTitle className="text-2xl">{guideTitle}</CardTitle>
								</CardHeader>
								<CardContent>
									<ul className="space-y-3 text-muted-foreground">
										{guidePoints.map((point) => (
											<li key={point} className="flex gap-3">
												<CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
												<span>{point}</span>
											</li>
										))}
									</ul>
								</CardContent>
							</Card>
						)}
						{faqs.length > 0 && (
							<Card className="rounded-md border-border/60">
								<CardHeader>
									<CardTitle className="text-2xl">Common Questions</CardTitle>
								</CardHeader>
								<CardContent className="space-y-5">
									{faqs.map((faq) => (
										<div key={faq.question}>
											<h3 className="font-semibold">{faq.question}</h3>
											<p className="mt-1 text-sm leading-relaxed text-muted-foreground">
												{faq.answer}
											</p>
										</div>
									))}
								</CardContent>
							</Card>
						)}
					</section>
				)}
			</main>
		</div>
	);
}
