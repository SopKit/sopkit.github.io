import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "QR Code Generator for Business - Free Online Tool | SopKit",
	description: "Generate optimized qr code generator for business details. Instantly copy or share customized outputs.",
	keywords: "qr code generator for business, qr-code-generator-business, free online, no signup, SopKit, browser utility",
	alternates: {
		canonical: "https://sopkit.github.io/qr-code-generator-business",
	},
	openGraph: {
		title: "QR Code Generator for Business - Free Online Tool | SopKit",
		description: "Generate optimized qr code generator for business details. Instantly copy or share customized outputs.",
		url: "https://sopkit.github.io/qr-code-generator-business",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "QR Code Generator for Business - Free Online Tool | SopKit",
		description: "Generate optimized qr code generator for business details. Instantly copy or share customized outputs.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/qr-code-generator-business");

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
						url: "https://sopkit.github.io/qr-code-generator-business",
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
