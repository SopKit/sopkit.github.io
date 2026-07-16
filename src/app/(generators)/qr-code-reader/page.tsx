import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import QrReaderPremium from "@/components/tools/utilities/QrReaderPremium";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "QR Code Reader",
	description: "Privacy-friendly, 100% client-side qr code reading. Run secure local processing in your browser with zero file uploads and no data selling. No AI training on your data. Fast, safe, and free forever.",
	route: "/qr-code-reader",
	category: "generators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/qr-code-reader");

	if (!tool) {
		return notFound();
	}

	const appSchema = {
		"@context": "https://schema.org",
		"@type": "WebApplication",
		"name": "QR Code Reader",
		"url": "https://sopkit.github.io/qr-code-reader/",
		"applicationCategory": "UtilityApplication",
		"operatingSystem": "All",
		"browserRequirements": "Requires HTML5 support, camera access optionally",
		"description": "Scan and decode QR codes from images or using your camera online for free. Secure, browser-based QR reader with instant results.",
		"offers": {
			"@type": "Offer",
			"price": "0",
			"priceCurrency": "USD"
		}
	};

	const faqSchema = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		"mainEntity": [
			{
				"@type": "Question",
				"name": "Is this QR Code Reader secure?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Yes, our QR Code Reader is completely secure. The scanning process is executed entirely locally inside your browser. Your images or camera streams are never sent to any server."
				}
			},
			{
				"@type": "Question",
				"name": "How do I scan a QR code from a file?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Simply drop your QR code image file into the scanner or click upload to select an image from your device. It will automatically decode instantly."
				}
			}
		]
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
			/>
			<ToolLayout breadcrumbs={[]} tool={tool}>
				<QrReaderPremium />
			</ToolLayout>
		</>
	);
}
