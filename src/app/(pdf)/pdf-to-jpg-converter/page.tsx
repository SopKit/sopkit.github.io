import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PDFToImage from "@/components/tools/pdf/PDFToImage";


export const metadata = {
	title: "Free PDF to JPG Converter Online - No Signup | SopKit",
	description: "Manage, convert, edit, and secure PDF documents with our free PDF to JPG Converter online. Safe and private browser-based tool with no registration. 100% free.",
	keywords: "pdf to jpg converter, free online tool, no signup, pdf to jpg converter online, pdf, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/pdf-to-jpg-converter",
	},
	openGraph: {
		title: "Free PDF to JPG Converter Online - No Signup | SopKit",
		description: "Manage, convert, edit, and secure PDF documents with our free PDF to JPG Converter online. Safe and private browser-based tool with no registration. 100% free.",
		url: "https://sopkit.github.io/pdf-to-jpg-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free PDF to JPG Converter Online - No Signup | SopKit",
		description: "Manage, convert, edit, and secure PDF documents with our free PDF to JPG Converter online. Safe and private browser-based tool with no registration. 100% free.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/pdf-to-jpg-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PDFToImage />
		</ToolLayout>
	);
}
