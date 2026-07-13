import { Metadata } from "next";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import BreadcrumbsEnhanced from "@/components/seo/BreadcrumbsEnhanced";
import { Suspense } from "react";

export const metadata: Metadata = {
	title: "SopKit Pricing — 100% Free Client-Side Tools & API Packages",
	description: "Discover SopKit's plans. Access hundreds of online developer and file utilities completely free, or request custom API solutions.",
	alternates: {
		canonical: "https://sopkit.github.io/pricing/",
	},
	openGraph: {
		title: "SopKit Pricing — 100% Free Client-Side Tools & API Packages",
		description: "Browse free client-side tools and custom API integration rates.",
		url: "https://sopkit.github.io/pricing/",
		images: [{ url: "/og-images/packages.png" }],
	},
};

export default function PricingPage() {
	const faqSchema = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		"mainEntity": [
			{
				"@type": "Question",
				"name": "Are the online utilities really free?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Yes, 100% of the tools listed on SopKit are completely free to use, processed directly in your web browser with zero server uploads."
				}
			},
			{
				"@type": "Question",
				"name": "Do you offer API access?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Yes, we support enterprise packages and high-performance server-side APIs for custom batch file operations."
				}
			}
		]
	};

	const productSchema = {
		"@context": "https://schema.org",
		"@type": "Product",
		"name": "SopKit Utility Suite",
		"description": "Zero-dependency, strictly-typed browser and Node.js file manipulation packages.",
		"offers": {
			"@type": "AggregateOffer",
			"lowPrice": "0",
			"highPrice": "99",
			"priceCurrency": "USD"
		}
	};

	return (
		<div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(faqSchema),
				}}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(productSchema),
				}}
			/>
			<main className="flex-grow">
				{/* Header Section */}
				<section className="relative overflow-hidden bg-gradient-to-b from-primary/[0.03] via-transparent to-transparent py-16 md:py-24 border-b border-border/10">
					<div className="container mx-auto max-w-5xl px-4 text-center">
						<Suspense fallback={null}>
							<BreadcrumbsEnhanced suppressSchema={true} />
						</Suspense>

						<div className="mt-8 max-w-3xl mx-auto space-y-4">
							<span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded">
								Pricing Plans
							</span>
							<h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
								Fair & Transparent Pricing
							</h1>
							<p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
								Use our browser-based utility tools for free forever. Upgrade only if you need raw server API scaling or dedicated developer integration.
							</p>
						</div>
					</div>
				</section>

				{/* Pricing Cards */}
				<section className="container mx-auto max-w-5xl px-4 py-12 md:py-20">
					<div className="grid md:grid-cols-2 gap-8 items-start">
						{/* Plan Free */}
						<div className="p-8 rounded-3xl border border-border/40 bg-card/20 backdrop-blur-sm shadow-sm space-y-6 flex flex-col justify-between min-h-[500px]">
							<div className="space-y-6">
								<div className="space-y-2">
									<span className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Free Tier</span>
									<h2 className="text-3xl font-bold">Standard Tools</h2>
									<p className="text-xs text-muted-foreground">Perfect for individual developers, creators, and daily operations.</p>
								</div>
								<div className="flex items-baseline gap-1.5">
									<span className="text-4xl font-extrabold">$0</span>
									<span className="text-xs text-muted-foreground">forever</span>
								</div>
								<div className="space-y-3 pt-4 border-t border-border/10">
									<h3 className="text-xs font-bold text-foreground uppercase tracking-widest">What's Included:</h3>
									<ul className="space-y-2.5 text-xs text-muted-foreground">
										<li className="flex items-center gap-2">
											<Check className="h-4 w-4 text-primary shrink-0" />
											<span>Access to all 400+ online utilities</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="h-4 w-4 text-primary shrink-0" />
											<span>100% client-side privacy-first processing</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="h-4 w-4 text-primary shrink-0" />
											<span>No signup or account registration required</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="h-4 w-4 text-primary shrink-0" />
											<span>Unlimited daily files & data bandwidth</span>
										</li>
									</ul>
								</div>
							</div>
							<Link
								href="/"
								className="mt-8 w-full text-center inline-flex justify-center items-center rounded-full bg-foreground text-background py-3 text-xs font-bold hover:bg-foreground/90 transition-all"
							>
								Start Using Tools
							</Link>
						</div>

						{/* Plan Custom/Pro */}
						<div className="p-8 rounded-3xl border-2 border-primary bg-card/30 backdrop-blur-sm shadow-xl space-y-6 flex flex-col justify-between min-h-[500px] relative">
							<span className="absolute -top-3 right-6 text-[9px] font-bold uppercase tracking-widest bg-primary text-primary-foreground px-2.5 py-1 rounded">
								Popular
							</span>
							<div className="space-y-6">
								<div className="space-y-2">
									<span className="text-xs font-bold uppercase text-primary tracking-widest">Enterprise & API</span>
									<h2 className="text-3xl font-bold flex items-center gap-1.5">
										Custom API
										<Sparkles className="h-5 w-5 text-primary" />
									</h2>
									<p className="text-xs text-muted-foreground">For teams requiring batch cloud processors, webhook automation, or custom tools.</p>
								</div>
								<div className="flex items-baseline gap-1.5">
									<span className="text-4xl font-extrabold">Custom</span>
									<span className="text-xs text-muted-foreground">flat-rate</span>
								</div>
								<div className="space-y-3 pt-4 border-t border-border/10">
									<h3 className="text-xs font-bold text-foreground uppercase tracking-widest">What's Included:</h3>
									<ul className="space-y-2.5 text-xs text-muted-foreground">
										<li className="flex items-center gap-2">
											<Check className="h-4 w-4 text-primary shrink-0" />
											<span>High-concurrency server-side REST API access</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="h-4 w-4 text-primary shrink-0" />
											<span>Self-hosted npm packages via private registry</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="h-4 w-4 text-primary shrink-0" />
											<span>Custom tool development & branding integration</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="h-4 w-4 text-primary shrink-0" />
											<span>Dedicated developer support SLA</span>
										</li>
									</ul>
								</div>
							</div>
							<a
								href="https://sh20raj.github.io"
								target="_blank"
								rel="noopener noreferrer"
								className="mt-8 w-full text-center inline-flex justify-center items-center rounded-full bg-primary text-primary-foreground py-3 text-xs font-bold hover:bg-primary/90 transition-all"
							>
								Contact Sales
							</a>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
