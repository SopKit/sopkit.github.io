import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PDFCompressor from "@/components/tools/pdf/PDFCompressor";


export const metadata = {
	title: "Compress PDF to Exact KB Online Free | SopKit",
	description: "Compress PDF files to exact sizes like 100KB, 200KB, 500KB, or custom KB for forms and uploads online. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/compress-pdf-to-exact-kb",
	},
	openGraph: {
		title: "Compress PDF to Exact KB Online Free - No Signup | SopKit",
		description: "Compress PDF files to exact sizes like 100KB, 200KB, 500KB, or custom KB for forms and uploads online. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/compress-pdf-to-exact-kb",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Compress PDF to Exact KB Online Free - Fast & Secure",
		description: "Compress PDF files to exact sizes like 100KB, 200KB, 500KB, or custom KB for forms and uploads online. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/compress-pdf-to-exact-kb");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<PDFCompressor />
		</ToolLayout>
	);
}
