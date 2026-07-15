import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PDFCompressor from "@/components/tools/pdf/PDFCompressor";


export const metadata = {
	title: "Free Compress PDF to Exact KB Online - No Signup | SopKit",
	description: "Manage, convert, edit, and secure PDF documents with our free Compress PDF to Exact KB online. Safe and private browser-based tool with no registration.",
	keywords: "compress pdf to exact kb, free online tool, no signup, compress pdf to exact kb online, pdf, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/compress-pdf-to-exact-kb",
	},
	openGraph: {
		title: "Free Compress PDF to Exact KB Online - No Signup | SopKit",
		description: "Manage, convert, edit, and secure PDF documents with our free Compress PDF to Exact KB online. Safe and private browser-based tool with no registration.",
		url: "https://sopkit.github.io/compress-pdf-to-exact-kb",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Compress PDF to Exact KB Online - No Signup | SopKit",
		description: "Manage, convert, edit, and secure PDF documents with our free Compress PDF to Exact KB online. Safe and private browser-based tool with no registration.",
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
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PDFCompressor />
		</ToolLayout>
	);
}
