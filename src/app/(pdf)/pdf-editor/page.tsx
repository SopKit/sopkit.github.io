import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PDFEditor from "@/components/tools/pdf/PDFEditor";

export const metadata = {
	title: "Free PDF Editor Online - No Signup | SopKit",
	description: "Manage, convert, edit, and secure PDF documents with our free PDF Editor online. Safe and private browser-based tool with no registration. 100% free and secure.",
	keywords: "pdf editor, free online tool, no signup, pdf editor online, pdf, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/pdf-editor",
	},
	openGraph: {
		title: "Free PDF Editor Online - No Signup | SopKit",
		description: "Manage, convert, edit, and secure PDF documents with our free PDF Editor online. Safe and private browser-based tool with no registration. 100% free and secure.",
		url: "https://sopkit.github.io/pdf-editor",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free PDF Editor Online - No Signup | SopKit",
		description: "Manage, convert, edit, and secure PDF documents with our free PDF Editor online. Safe and private browser-based tool with no registration. 100% free and secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/pdf-editor");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PDFEditor />
		</ToolLayout>
	);
}
