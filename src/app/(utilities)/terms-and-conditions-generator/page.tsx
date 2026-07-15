import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Terms and Conditions Generator Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Terms and Conditions Generator online. Fast, secure browser-based utility with no registration. 100% free.",
	keywords: "terms and conditions generator, terms-and-conditions-generator, free online, no signup, SopKit, browser utility",
	alternates: {
		canonical: "https://sopkit.github.io/terms-and-conditions-generator",
	},
	openGraph: {
		title: "Free Terms and Conditions Generator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Terms and Conditions Generator online. Fast, secure browser-based utility with no registration. 100% free.",
		url: "https://sopkit.github.io/terms-and-conditions-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Terms and Conditions Generator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Terms and Conditions Generator online. Fast, secure browser-based utility with no registration. 100% free.",
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
						url: "https://sopkit.github.io/terms-and-conditions-generator/",
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
