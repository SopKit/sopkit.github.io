import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PDFToWord from "@/components/tools/pdf/PDFToWord";

export const metadata = {
	title: "Free PDF to Word Online - No Signup | SopKit",
	description: "Manage, convert, edit, and secure PDF documents with our free PDF to Word online. Safe and private browser-based tool with no registration. No signup required.",
	keywords: "pdf to word, free online tool, no signup, pdf to word online, pdf, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/pdf-to-word",
	},
	openGraph: {
		title: "Free PDF to Word Online - No Signup | SopKit",
		description: "Manage, convert, edit, and secure PDF documents with our free PDF to Word online. Safe and private browser-based tool with no registration. No signup required.",
		url: "https://sopkit.github.io/pdf-to-word",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free PDF to Word Online - No Signup | SopKit",
		description: "Manage, convert, edit, and secure PDF documents with our free PDF to Word online. Safe and private browser-based tool with no registration. No signup required.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/pdf-to-word");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PDFToWord />
		</ToolLayout>
	);
}
