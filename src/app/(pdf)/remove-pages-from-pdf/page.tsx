import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PDFPageDelete from "@/components/tools/pdf/PDFPageDelete";


export const metadata = {
	title: "Remove Pages from PDF Online Free | SopKit",
	description: "Delete unwanted pages from a PDF file online. Select pages, remove them, and download a clean PDF for free. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/remove-pages-from-pdf/",
	},
	openGraph: {
		title: "Remove Pages from PDF Online Free - No Signup | SopKit",
		description: "Delete unwanted pages from a PDF file online. Select pages, remove them, and download a clean PDF for free. No signup, no uploads, 100% private browser-based to",
		url: "https://sopkit.github.io/remove-pages-from-pdf",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Remove Pages from PDF Online Free - Fast & Secure",
		description: "Delete unwanted pages from a PDF file online. Select pages, remove them, and download a clean PDF for free. No signup, no uploads, 100% private browser-based to",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/remove-pages-from-pdf");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PDFPageDelete />
		</ToolLayout>
	);
}
