import { getAllToolsByCategory, Tool } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";
import { PremiumHero } from "@/components/landing/PremiumHero";
import { GridPattern } from "@/components/shared/GridPattern";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, ArrowRight } from "lucide-react";

export const metadata = generateToolMetadata({
	name: "Calculators",
	description: "Privacy-friendly, 100% client-side calculators. Run secure local processing in your browser with zero file uploads and no data selling. No AI training on your data. Fast, safe, and free forever.",
	route: "/calculators",
	category: "calculators",
});

export default function CalculatorsHub() {
	const tools = getAllToolsByCategory("calculators");

	return (
		<div className="min-h-screen bg-background">
			<main>
				<PremiumHero 
					title="Smart Calculators" 
					subtitle="Accurate and easy-to-use calculators for every need. From finance to health, get the answers you need in seconds."
				/>
				
				<div className="container mx-auto px-4 py-16 max-w-7xl relative">
					<GridPattern className="opacity-10" />
					
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
						{tools.map((tool: Tool) => (
							<Link key={tool.id} href={tool.route}>
								<Card className="h-full border border-border/80 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all duration-200 group overflow-hidden bg-card/60 backdrop-blur-sm">
									<CardHeader className="pb-2">
										<CardTitle className="flex items-center justify-between">
											<span className="text-xl font-bold tracking-tight">{tool.name}</span>
											<Calculator className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-all" />
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
											{tool.description}
										</p>
										<div className="mt-4 flex items-center text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest gap-1">
											Calculate <ArrowRight className="w-3 h-3" />
										</div>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>

					{/* Rich SEO Content */}
					<section className="mt-20 max-w-4xl mx-auto space-y-8">
						<div className="p-8 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm">
							<h2 className="text-2xl font-bold tracking-tight mb-4">Free Online Calculators — Finance, Health, Academic & Construction Tools</h2>
							<p className="text-sm text-muted-foreground leading-relaxed mb-4">
								SopKit's calculator collection covers 40+ essential calculators for finance, health, academics, construction, and everyday life. From EMI and SIP calculators for investment planning to BMI, BMR, and TDEE calculators for health tracking — every calculation runs 100% client-side in your browser with zero data uploads.
							</p>
							<p className="text-sm text-muted-foreground leading-relaxed mb-4">
								Academic calculators help students convert CGPA to percentage, calculate attendance shortages, determine required marks, and estimate graduation grades. Financial tools cover compound interest, loan eligibility, rental affordability, GST, income tax, and more. Construction calculators handle brick, paint, and tile estimates for home improvement projects.
							</p>
							<p className="text-sm text-muted-foreground leading-relaxed">
								All calculators are free with no registration, no usage limits, and no data storage. Your personal and financial data stays on your device — we never see or store your inputs.
							</p>
						</div>
					</section>
				</div>
			</main>
		</div>
	);
}
