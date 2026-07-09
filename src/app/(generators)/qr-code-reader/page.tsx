import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import QrReaderPremium from "@/components/tools/utilities/QrReaderPremium";

export const metadata = {
	title: "QR Code Reader Online Free - No Signup | SopKit",
	description: "Scan and decode QR codes from images or using your camera online for free. Secure, browser-based QR reader with instant results and no data storage. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/qr-code-reader/",
	},
	openGraph: {
		title: "QR Code Reader Online Free - No Signup",
		description: "Scan and decode QR codes from images or using your camera online for free. Secure, browser-based QR reader with instant results and no data storage. No signup, ",
		url: "https://sopkit.github.io/qr-code-reader/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "QR Code Reader Online Free - Fast & Secure",
		description: "Scan and decode QR codes from images or using your camera online for free. Secure, browser-based QR reader with instant results and no data storage. No signup, ",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

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
