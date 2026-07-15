import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Calorie Deficit Calculator Online - No Signup | SopKit",
	description: "Compute rates, taxes, averages, and conversions with our free Calorie Deficit Calculator online. Quick, accurate browser calculator with no registration.",
	keywords: "calorie deficit calculator, weight loss calculator, tdee calculator, daily calorie intake, fat loss calculator, maintenance calories",
	alternates: {
		canonical: "https://sopkit.github.io/calorie-deficit-calculator",
	},
	openGraph: {
		title: "Free Calorie Deficit Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Calorie Deficit Calculator online. Quick, accurate browser calculator with no registration.",
		url: "https://sopkit.github.io/calorie-deficit-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Calorie Deficit Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Calorie Deficit Calculator online. Quick, accurate browser calculator with no registration.",
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
