import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PDFPageDelete from "@/components/tools/pdf/PDFPageDelete";


export const metadata = {
	title: "Free Remove Pages from PDF Online - No Signup | SopKit",
	description: "Manage, convert, edit, and secure PDF documents with our free Remove Pages from PDF online. Safe and private browser-based tool with no registration. 100% free.",
	keywords: "remove pages from pdf, free online tool, no signup, remove pages from pdf online, pdf, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/remove-pages-from-pdf",
	},
	openGraph: {
		title: "Free Remove Pages from PDF Online - No Signup | SopKit",
		description: "Manage, convert, edit, and secure PDF documents with our free Remove Pages from PDF online. Safe and private browser-based tool with no registration. 100% free.",
		url: "https://sopkit.github.io/remove-pages-from-pdf",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Remove Pages from PDF Online - No Signup | SopKit",
		description: "Manage, convert, edit, and secure PDF documents with our free Remove Pages from PDF online. Safe and private browser-based tool with no registration. 100% free.",
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
