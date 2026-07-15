import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free HTML to PDF Converter Online - No Signup | SopKit",
	description: "Manage, convert, edit, and secure PDF documents with our free HTML to PDF Converter online. Safe and private browser-based tool with no registration. 100% free.",
	keywords: "html to pdf converter, free online tool, no signup, html to pdf converter online, pdf, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/html-to-pdf",
	},
	openGraph: {
		title: "Free HTML to PDF Converter Online - No Signup | SopKit",
		description: "Manage, convert, edit, and secure PDF documents with our free HTML to PDF Converter online. Safe and private browser-based tool with no registration. 100% free.",
		url: "https://sopkit.github.io/html-to-pdf",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free HTML to PDF Converter Online - No Signup | SopKit",
		description: "Manage, convert, edit, and secure PDF documents with our free HTML to PDF Converter online. Safe and private browser-based tool with no registration. 100% free.",
		images: ["/og-image.jpg"],
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
