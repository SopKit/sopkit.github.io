import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free WhatsApp Link Generator Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free WhatsApp Link Generator online. Fast, secure browser-based utility with no registration. Try it free now.",
	keywords: "whatsapp link generator, whatsapp-link-generator, free online, no signup, SopKit, browser utility",
	alternates: {
		canonical: "https://sopkit.github.io/whatsapp-link-generator",
	},
	openGraph: {
		title: "Free WhatsApp Link Generator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free WhatsApp Link Generator online. Fast, secure browser-based utility with no registration. Try it free now.",
		url: "https://sopkit.github.io/whatsapp-link-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free WhatsApp Link Generator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free WhatsApp Link Generator online. Fast, secure browser-based utility with no registration. Try it free now.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/whatsapp-link-generator");

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
						url: "https://sopkit.github.io/whatsapp-link-generator/",
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
