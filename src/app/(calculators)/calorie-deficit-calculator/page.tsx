import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Calorie Deficit Calculator - Daily Calories for Weight Loss | SopKit",
	description: "Find the daily calorie deficit you need to lose weight. Free calculator estimates your maintenance calories (TDEE) and target intake for safe, steady fat loss. No signup, works in your browser.",
	keywords: "calorie deficit calculator, weight loss calculator, tdee calculator, daily calorie intake, fat loss calculator, maintenance calories",
	alternates: {
		canonical: "https://sopkit.github.io/calorie-deficit-calculator/",
	},
	openGraph: {
		title: "Calorie Deficit Calculator - Daily Calories for Weight Loss",
		description: "Find the daily calorie deficit you need to lose weight. Estimate your TDEE and target intake for safe, steady fat loss. Free, no signup.",
		url: "https://sopkit.github.io/calorie-deficit-calculator/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Calorie Deficit Calculator - Daily Calories for Weight Loss",
		description: "Find the daily calorie deficit you need to lose weight. Estimate your TDEE and target intake for safe, steady fat loss. Free, no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/calorie-deficit-calculator");

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
						url: "https://sopkit.github.io/calorie-deficit-calculator/",
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
