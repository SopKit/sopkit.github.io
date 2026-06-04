import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Terms and Conditions Generator - Free Online Tool | SopKit",
	description: "Generate a custom Terms and Conditions page for your website, app, blog, or store. Protect your intellectual property and limit liability.",
	keywords: "terms and conditions generator, terms-and-conditions-generator, free online, no signup, SopKit, browser utility",
	alternates: {
		canonical: "https://sopkit.github.io/terms-and-conditions-generator",
	},
	openGraph: {
		title: "Terms and Conditions Generator - Free Online Tool | SopKit",
		description: "Generate a custom Terms and Conditions page for your website, app, blog, or store. Protect your intellectual property and limit liability.",
		url: "https://sopkit.github.io/terms-and-conditions-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Terms and Conditions Generator - Free Online Tool | SopKit",
		description: "Generate a custom Terms and Conditions page for your website, app, blog, or store. Protect your intellectual property and limit liability.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/terms-and-conditions-generator");

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
						url: "https://sopkit.github.io/terms-and-conditions-generator",
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
