import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free Markdown to PDF Converter Online - No Signup | SopKit",
	description: "Format, clean, sort, and analyze text files instantly with our free Markdown to PDF Converter online. Fast and private browser utility with no signup.",
	keywords: "markdown to pdf converter, free online tool, no signup, markdown to pdf converter online, text, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/markdown-to-pdf",
	},
	openGraph: {
		title: "Free Markdown to PDF Converter Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free Markdown to PDF Converter online. Fast and private browser utility with no signup.",
		url: "https://sopkit.github.io/markdown-to-pdf",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Markdown to PDF Converter Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free Markdown to PDF Converter online. Fast and private browser utility with no signup.",
		images: ["/og-image.jpg"],
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
