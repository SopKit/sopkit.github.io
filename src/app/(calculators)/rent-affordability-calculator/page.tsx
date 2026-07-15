import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Rent Affordability Calculator Online - No Signup | SopKit",
	description: "Compute rates, taxes, averages, and conversions with our free Rent Affordability Calculator online. Quick, accurate browser calculator with no registration.",
	keywords: "rent affordability calculator, rent-affordability-calculator, free online, no signup, SopKit, browser utility",
	alternates: {
		canonical: "https://sopkit.github.io/rent-affordability-calculator",
	},
	openGraph: {
		title: "Free Rent Affordability Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Rent Affordability Calculator online. Quick, accurate browser calculator with no registration.",
		url: "https://sopkit.github.io/rent-affordability-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Rent Affordability Calculator Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Rent Affordability Calculator online. Quick, accurate browser calculator with no registration.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/rent-affordability-calculator");

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
						url: "https://sopkit.github.io/rent-affordability-calculator/",
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
