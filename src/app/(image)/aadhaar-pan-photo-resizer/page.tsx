import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PanCardResizer from "@/components/tools/exam/PanCardResizer";


export const metadata = {
	title: "Aadhaar and PAN Card Photo Resizer Online Free | SopKit",
	description: "Resize and compress photos and signatures for Aadhaar, PAN card, KYC, and online document forms. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/aadhaar-pan-photo-resizer",
	},
	openGraph: {
		title: "Aadhaar and PAN Card Photo Resizer Online Free - No Signup | SopKit",
		description: "Resize and compress photos and signatures for Aadhaar, PAN card, KYC, and online document forms. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/aadhaar-pan-photo-resizer",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Aadhaar and PAN Card Photo Resizer Online Free - Fast & Secure",
		description: "Resize and compress photos and signatures for Aadhaar, PAN card, KYC, and online document forms. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/aadhaar-pan-photo-resizer");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<PanCardResizer />
		</ToolLayout>
	);
}
