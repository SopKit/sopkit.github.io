import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Daily Water Intake Calculator Online - No Signup | SopKit",
	description: "Compute rates, taxes, averages, and conversions with our free Daily Water Intake Calculator online. Quick, accurate browser calculator with no registration.",
	keywords: "daily water intake calculator, water-intake-calculator, free online, no signup, SopKit, browser utility",
	alternates: {
		canonical: "https://sopkit.github.io/water-intake-calculator",
	},
	openGraph: {
		title: "Free Daily Water Intake Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Daily Water Intake Calculator online. Quick, accurate browser calculator with no registration.",
		url: "https://sopkit.github.io/water-intake-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Daily Water Intake Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Daily Water Intake Calculator online. Quick, accurate browser calculator with no registration.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/water-intake-calculator");

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
						url: "https://sopkit.github.io/water-intake-calculator/",
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
