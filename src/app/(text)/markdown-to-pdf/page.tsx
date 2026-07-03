import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Markdown to PDF Converter Online Free | SopKit",
	description: "Convert Markdown text into a clean, print-ready PDF document instantly. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/markdown-to-pdf",
	},
	openGraph: {
		title: "Markdown to PDF Converter Online Free - No Signup | SopKit",
		description: "Convert Markdown text into a clean, print-ready PDF document instantly. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/markdown-to-pdf",
		siteName: "SopKit",
		images: [{ url: "/og-images/text-tools.png" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Markdown to PDF Converter Online Free - Fast & Secure",
		description: "Convert Markdown text into a clean, print-ready PDF document instantly. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-images/text-tools.png"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/markdown-to-pdf");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
