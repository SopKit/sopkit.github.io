import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Instagram Bio Generator Online - No Signup | SopKit",
	description: "Create custom content with our free Instagram Bio Generator online. Generate high-quality outputs instantly with no registration required. 100% free and secure.",
	keywords: "instagram bio generator, instagram-bio-generator, free online, no signup, SopKit, browser utility",
	alternates: {
		canonical: "https://sopkit.github.io/instagram-bio-generator",
	},
	openGraph: {
		title: "Free Instagram Bio Generator Online - No Signup | SopKit",
		description: "Create custom content with our free Instagram Bio Generator online. Generate high-quality outputs instantly with no registration required. 100% free and secure.",
		url: "https://sopkit.github.io/instagram-bio-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Instagram Bio Generator Online - No Signup | SopKit",
		description: "Create custom content with our free Instagram Bio Generator online. Generate high-quality outputs instantly with no registration required. 100% free and secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/instagram-bio-generator");

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
						url: "https://sopkit.github.io/instagram-bio-generator/",
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
