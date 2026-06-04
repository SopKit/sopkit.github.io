import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import QrReaderPremium from "@/components/tools/utilities/QrGeneratorPremium";

export const metadata = {
	title: "QR Code Reader Online Free - No Signup | SopKit",
	description: "Scan and decode QR codes from images or using your camera online for free. Secure, browser-based QR reader with instant results and no data storage. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/qr-code-reader",
	},
	openGraph: {
		title: "QR Code Reader Online Free - No Signup",
		description: "Scan and decode QR codes from images or using your camera online for free. Secure, browser-based QR reader with instant results and no data storage. No signup, ",
		url: "https://sopkit.github.io/qr-code-reader",
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

	return (
		<ToolLayout tool={tool}>
			<QrReaderPremium />
		</ToolLayout>
	);
}
