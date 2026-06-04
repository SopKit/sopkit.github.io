import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Profit Margin Calculator - Free Online Tool | SopKit",
	description: "Calculate your profit margin calculator instantly. Free browser-based calculator with detailed breakdowns.",
	keywords: "profit margin calculator, profit-margin-calculator, free online, no signup, SopKit, browser utility",
	alternates: {
		canonical: "https://sopkit.github.io/profit-margin-calculator",
	},
	openGraph: {
		title: "Profit Margin Calculator - Free Online Tool | SopKit",
		description: "Calculate your profit margin calculator instantly. Free browser-based calculator with detailed breakdowns.",
		url: "https://sopkit.github.io/profit-margin-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Profit Margin Calculator - Free Online Tool | SopKit",
		description: "Calculate your profit margin calculator instantly. Free browser-based calculator with detailed breakdowns.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/profit-margin-calculator");

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
						url: "https://sopkit.github.io/profit-margin-calculator",
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
			<ToolLayout tool={tool} showHireMe={true}>
				<IntentToolDispatcher toolId={tool.id} />
			</ToolLayout>
		</>
	);
}
