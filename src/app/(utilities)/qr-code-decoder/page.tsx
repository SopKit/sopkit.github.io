import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import QrGeneratorPremium from "@/components/tools/utilities/QrGeneratorPremium";

export const metadata = {
	title: "Free QR Code Decoder Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free QR Code Decoder online. Fast, secure browser-based utility with no registration. No registration needed.",
	keywords: "qr code decoder, free online tool, no signup, qr code decoder online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/qr-code-decoder",
	},
	openGraph: {
		title: "Free QR Code Decoder Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free QR Code Decoder online. Fast, secure browser-based utility with no registration. No registration needed.",
		url: "https://sopkit.github.io/qr-code-decoder",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free QR Code Decoder Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free QR Code Decoder online. Fast, secure browser-based utility with no registration. No registration needed.",
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
