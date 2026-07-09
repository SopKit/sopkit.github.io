import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Slogan Generator - Free Online Tool | SopKit",
	description: "Generate optimized slogan generator details. Instantly copy or share customized outputs.",
	keywords: "slogan generator, slogan-generator, free online, no signup, SopKit, browser utility",
	alternates: {
		canonical: "https://sopkit.github.io/slogan-generator/",
	},
	openGraph: {
		title: "Slogan Generator - Free Online Tool | SopKit",
		description: "Generate optimized slogan generator details. Instantly copy or share customized outputs.",
		url: "https://sopkit.github.io/slogan-generator/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Slogan Generator - Free Online Tool | SopKit",
		description: "Generate optimized slogan generator details. Instantly copy or share customized outputs.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/slogan-generator");

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
						url: "https://sopkit.github.io/slogan-generator/",
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
