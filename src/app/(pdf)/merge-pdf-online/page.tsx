import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PDFMerger from "@/components/tools/pdf/PDFMerger";


export const metadata = {
	title: "Free Merge PDF Online Online - No Signup | SopKit",
	description: "Manage, convert, edit, and secure PDF documents with our free Merge PDF Online online. Safe and private browser-based tool with no registration. Free & secure.",
	keywords: "merge pdf online, free online tool, no signup, merge pdf online online, pdf, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/merge-pdf-online",
	},
	openGraph: {
		title: "Free Merge PDF Online Online - No Signup | SopKit",
		description: "Manage, convert, edit, and secure PDF documents with our free Merge PDF Online online. Safe and private browser-based tool with no registration. Free & secure.",
		url: "https://sopkit.github.io/merge-pdf-online",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Merge PDF Online Online - No Signup | SopKit",
		description: "Manage, convert, edit, and secure PDF documents with our free Merge PDF Online online. Safe and private browser-based tool with no registration. Free & secure.",
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
