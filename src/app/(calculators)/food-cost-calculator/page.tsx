import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Food Cost Calculator Online - No Signup | SopKit",
	description: "Compute rates, taxes, averages, and conversions with our free Food Cost Calculator online. Quick, accurate browser calculator with no registration. Easy to use.",
	keywords: "food cost calculator, food-cost-calculator, free online, no signup, SopKit, browser utility",
	alternates: {
		canonical: "https://sopkit.github.io/food-cost-calculator",
	},
	openGraph: {
		title: "Free Food Cost Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Food Cost Calculator online. Quick, accurate browser calculator with no registration. Easy to use.",
		url: "https://sopkit.github.io/food-cost-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Food Cost Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Food Cost Calculator online. Quick, accurate browser calculator with no registration. Easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/food-cost-calculator");

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
						url: "https://sopkit.github.io/food-cost-calculator/",
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
