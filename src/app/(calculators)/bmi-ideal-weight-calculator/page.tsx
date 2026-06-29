import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "BMI + Ideal Weight Calculator - Free Online Tool | SopKit",
	description: "Calculate your bmi + ideal weight calculator instantly. Free browser-based calculator with detailed breakdowns.",
	keywords: "bmi + ideal weight calculator, bmi-ideal-weight-calculator, free online, no signup, SopKit, browser utility",
	alternates: {
		canonical: "https://sopkit.github.io/bmi-ideal-weight-calculator/",
	},
	openGraph: {
		title: "BMI + Ideal Weight Calculator - Free Online Tool | SopKit",
		description: "Calculate your bmi + ideal weight calculator instantly. Free browser-based calculator with detailed breakdowns.",
		url: "https://sopkit.github.io/bmi-ideal-weight-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "BMI + Ideal Weight Calculator - Free Online Tool | SopKit",
		description: "Calculate your bmi + ideal weight calculator instantly. Free browser-based calculator with detailed breakdowns.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/bmi-ideal-weight-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "SoftwareApplication",
						name: tool.name,
						description: tool.description,
						url: "https://sopkit.github.io/bmi-ideal-weight-calculator",
						applicationCategory: "UtilitiesApplication",
						operatingSystem: "Any",
						offers: {
							"@type": "Offer",
							price: "0",
							priceCurrency: "USD"
						}
					})
				}}
			/>
			<ToolLayout breadcrumbs={[]} tool={tool} showHireMe={true}>
				<IntentToolDispatcher toolId={tool.id} />
			</ToolLayout>
		</>
	);
}
