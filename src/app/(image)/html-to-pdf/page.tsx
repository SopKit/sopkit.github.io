import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free HTML to PDF Converter Online - Convert HTML to PDF | SopKit",
	description: "Convert HTML snippets or code strings directly into printable PDF documents in your browser. Fast, free, and executed fully client-side for maximum privacy.",
	alternates: {
		canonical: "https://sopkit.github.io/html-to-pdf/",
	},
	openGraph: {
		title: "Free HTML to PDF Converter Online - Convert HTML to PDF | SopKit",
		description: "Convert HTML snippets or code strings directly into printable PDF documents in your browser. Fast, free, and executed fully client-side for maximum privacy.",
		url: "https://sopkit.github.io/html-to-pdf/",
		siteName: "SopKit",
		images: [{ url: "/og-images/pdf-tools.png" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free HTML to PDF Converter Online - Convert HTML to PDF | SopKit",
		description: "Convert HTML snippets or code strings directly into printable PDF documents in your browser. Fast, free, and executed fully client-side for maximum privacy.",
		images: ["/og-images/pdf-tools.png"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/html-to-pdf");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
