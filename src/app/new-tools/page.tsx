import ToolLayout from "@/components/tools/shared/ToolLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Info, Layers, Wrench } from "lucide-react";
import { MANUAL_TOOL_CONTENT } from "@/data/generated-manual-content";
import {
	ToolFeatures,
	ToolSteps,
	ToolFAQ,
	ToolTrust,
} from "@/components/tools/shared/ToolSharedComponents";

export const metadata = {
	title: "New Tools & Updates — Latest Free Online Tools Added | SopKit",
	description: "Discover the newest free online tools added to SopKit's library. Track release updates, from embed widgets and API testers to calculators, YouTube utilities, and more. 100% client-side, private, free forever.",
	keywords: "new online tools, free tools added, latest online utilities, new browser tools, sopkit updates, free online toolkit, newly added web tools",
	alternates: {
		canonical: "https://sopkit.github.io/new-tools",
	},
	openGraph: {
		title: "New Tools & Updates — Latest Free Online Tools Added | SopKit",
		description: "Discover the newest free online tools added to SopKit's library. Track release updates — from embed widgets and API testers to calculators and YouTube utilities. 100% client-side, no data uploads.",
		url: "https://sopkit.github.io/new-tools",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "New Tools & Updates — Latest Free Online Tools Added | SopKit",
		description: "Discover the newest free online tools added to SopKit's library. Track release updates — from embed widgets and API testers to calculators and YouTube utilities. 100% client-side, no data uploads.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function NewToolsPage() {
	const tool = {
		id: "new-tools",
		name: "New Tools & Updates — Latest Free Online Tools",
		description: "Track newly added tools, release updates, and codebase expansion history of SopKit's growing library of 600+ free online tools.",
		route: "/new-tools",
		category: "company",
	};

	const manualContent = MANUAL_TOOL_CONTENT["new-tools"];

	const updates = [
		{
			date: "July 12, 2026",
			title: "100% Ad-Free iframe Tool Embeds",
			badge: "Feature",
			intent: "Drive referral loops and build high-quality contextual backlinks. Allows bloggers and web developers to embed fully sandboxed, client-side SopKit tools directly on their websites without any ads.",
			tools: ["Embed Tool Router (/embed-tool/?id=...)"],
			management: "Managed via src/app/embed-tool/page.tsx and src/components/tools/shared/EmbedWidgetGiver.tsx."
		},
		{
			date: "July 11, 2026",
			title: "API Credentials Tester Suite",
			badge: "Developer",
			intent: "Capture high-intent developer searches for credentials verification. Tests keys client-side to guarantee no server intercept.",
			tools: [
				"OpenAI API Tester", "Google Gemini API Tester", "Stripe API Tester", 
				"Groq API Tester", "DeepSeek API Tester", "Anthropic Claude Tester",
				"Amazon SES API Tester", "and 33 other third-party API testers"
			],
			management: "Components located in src/components/tools/developer/ApiKeyTester.tsx and mapped inside src/components/tools/shared/IntentToolDispatcher.tsx."
		},
		{
			date: "July 10, 2026",
			title: "Interactive Calculators Expansion",
			badge: "Calculators",
			intent: "Target student and personal finance audiences with instant, offline-first calculators.",
			tools: [
				"Compound Interest Calculator", "Mortgage Calculator", "Car Loan Calculator", 
				"ROI Calculator", "Savings Goal Calculator", "Tip Calculator", 
				"BMI Calculator", "Fuel Cost Calculator", "Inflation Calculator", "Break-Even Calculator"
			],
			management: "Calculators are configured in src/components/tools/calculators/BuiltInCalculators.tsx."
		},
		{
			date: "July 09, 2026",
			title: "YouTube SEO Utility Suite",
			badge: "YouTube",
			intent: "Capture video creator searches and assist with metadata optimization and script writing.",
			tools: [
				"YouTube Embed Code Generator", "YouTube Subscribe Link Generator", 
				"YouTube Title Capitalizer", "YouTube Timestamp Link Generator", 
				"YouTube Title Length Checker", "YouTube Money Earnings Calculator"
			],
			management: "YouTube tools located in src/components/tools/youtube/ folder."
		}
	];

	return (
		<ToolLayout
			breadcrumbs={[
				{ name: "New Tools & Updates", url: "/new-tools", isLast: true },
			]}
			tool={tool}
		>
			<div className="space-y-8">
				<div className="text-center max-w-2xl mx-auto space-y-2">
					<p className="text-sm text-muted-foreground">
						We frequently update SopKit with new developer resources, calculators, and media utilities.
						Here is the log of our most recent tools, along with their design intents and codebase management guidelines.
					</p>
				</div>

				<div className="space-y-6">
					{updates.map((update, index) => (
						<Card key={index} className="border border-border/40 bg-card/25 backdrop-blur-sm overflow-hidden">
							<CardContent className="p-6 space-y-4">
								<div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/10 pb-3">
									<div className="flex items-center gap-2">
										<Calendar className="h-4 w-4 text-primary" />
										<span className="text-xs font-bold text-muted-foreground">{update.date}</span>
									</div>
									<Badge className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/25 rounded-full text-[10px] px-2.5 py-0.5">
										{update.badge}
									</Badge>
								</div>

								<div className="space-y-2">
									<h3 className="text-lg font-black tracking-tight text-foreground">{update.title}</h3>
									
									<div className="flex items-start gap-2.5 bg-muted/20 p-3 rounded-lg text-xs leading-relaxed">
										<Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
										<div>
											<span className="font-bold text-foreground block mb-0.5">Design Intent & Value:</span>
											<p className="text-muted-foreground">{update.intent}</p>
										</div>
									</div>

									<div className="flex items-start gap-2.5 bg-muted/20 p-3 rounded-lg text-xs leading-relaxed">
										<Layers className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
										<div>
											<span className="font-bold text-foreground block mb-0.5">Included Tools:</span>
											<ul className="list-disc pl-4 space-y-1 text-muted-foreground">
												{update.tools.map((t, idx) => (
													<li key={idx}>{t}</li>
												))}
											</ul>
										</div>
									</div>

									<div className="flex items-start gap-2.5 bg-muted/20 p-3 rounded-lg text-xs leading-relaxed">
										<Wrench className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
										<div>
											<span className="font-bold text-foreground block mb-0.5">How to Manage:</span>
											<p className="text-muted-foreground">{update.management}</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Rich SEO Content: Article from manual content */}
				{manualContent?.whatItIs && (
					<section className="scroll-mt-24 max-w-4xl mx-auto">
						<div className="space-y-8">
							{manualContent.whatItIs.split("\n").map((line, i) => {
								if (line.startsWith("## ")) {
									return (
										<h2
											key={i}
											className="text-3xl md:text-5xl font-extrabold tracking-tight mt-16 mb-8 text-foreground"
										>
											{line.replace("## ", "")}
										</h2>
									);
								}
								if (line.startsWith("### ")) {
									return (
										<h3
											key={i}
											className="text-2xl md:text-3xl font-bold tracking-tight mt-12 mb-6 text-foreground/90"
										>
											{line.replace("### ", "")}
										</h3>
									);
								}
								if (line.startsWith("- ")) {
									return (
										<li
											key={i}
											className="text-lg text-muted-foreground ml-6 list-disc"
										>
											{line.replace("- ", "")}
										</li>
									);
								}
								if (line.trim() === "") return <div key={i} className="h-4" />;
								return (
									<p
										key={i}
										className="text-xl text-muted-foreground leading-relaxed whitespace-pre-line"
									>
										{line}
									</p>
								);
							})}
						</div>
					</section>
				)}

				{/* Features from manual content */}
				{manualContent?.features && (
					<ToolFeatures features={manualContent.features} />
				)}

				{/* How-to steps from manual content */}
				{manualContent?.howTo && (
					<ToolSteps
						steps={manualContent.howTo.steps}
						toolName={tool.name}
					/>
				)}

				{/* FAQ from manual content */}
				{manualContent?.faqs && (
					<ToolFAQ faqs={manualContent.faqs} toolName={tool.name} />
				)}

				{/* Trust indicators */}
				<div className="pt-8">
					<ToolTrust />
				</div>
			</div>
		</ToolLayout>
	);
}
