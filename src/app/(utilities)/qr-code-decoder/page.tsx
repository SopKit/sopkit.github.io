import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import QrGeneratorPremium from "@/components/tools/utilities/QrGeneratorPremium";

export const metadata = {
	title: "QR Code Decoder Online Free - No Signup | SopKit",
	description: "Free qr code decoder tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/qr-code-decoder/",
	},
	openGraph: {
		title: "QR Code Decoder Online Free - No Signup",
		description: "Free qr code decoder tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/qr-code-decoder/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "QR Code Decoder Online Free - Fast & Secure",
		description: "Free qr code decoder tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/qr-code-decoder");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<QrGeneratorPremium />
		</ToolLayout>
	);
}
