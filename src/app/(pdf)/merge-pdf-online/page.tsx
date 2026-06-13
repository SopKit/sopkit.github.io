import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PDFMerger from "@/components/tools/pdf/PDFMerger";


export const metadata = {
	title: "Merge PDF Online Free | SopKit",
	description: "Combine multiple PDF files into one document. Reorder files and download a merged PDF instantly. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/merge-pdf-online",
	},
	openGraph: {
		title: "Merge PDF Online Free - No Signup | SopKit",
		description: "Combine multiple PDF files into one document. Reorder files and download a merged PDF instantly. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/merge-pdf-online",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Merge PDF Online Free - Fast & Secure",
		description: "Combine multiple PDF files into one document. Reorder files and download a merged PDF instantly. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/merge-pdf-online");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PDFMerger />
		</ToolLayout>
	);
}
