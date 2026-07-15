import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Product Description Generator Online - No Signup | SopKit",
	description: "Create custom content with our free Product Description Generator online. Generate high-quality outputs instantly with no registration required. Free & secure.",
	keywords: "product description generator, product-description-generator, free online, no signup, SopKit, browser utility",
	alternates: {
		canonical: "https://sopkit.github.io/product-description-generator",
	},
	openGraph: {
		title: "Free Product Description Generator Online - No Signup | SopKit",
		description: "Create custom content with our free Product Description Generator online. Generate high-quality outputs instantly with no registration required. Free & secure.",
		url: "https://sopkit.github.io/product-description-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Product Description Generator Online - No Signup | SopKit",
		description: "Create custom content with our free Product Description Generator online. Generate high-quality outputs instantly with no registration required. Free & secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/product-description-generator");

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
						url: "https://sopkit.github.io/product-description-generator/",
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
