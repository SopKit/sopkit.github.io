import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PDFUnlock from "@/components/tools/pdf/PDFUnlock";

export const metadata = {
	title: "Free PDF Unlocker Online - No Signup | SopKit",
	description: "Manage, convert, edit, and secure PDF documents with our free PDF Unlocker online. Safe and private browser-based tool with no registration. No signup required.",
	keywords: "pdf unlocker, free online tool, no signup, pdf unlocker online, pdf, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/pdf-unlocker",
	},
	openGraph: {
		title: "Free PDF Unlocker Online - No Signup | SopKit",
		description: "Manage, convert, edit, and secure PDF documents with our free PDF Unlocker online. Safe and private browser-based tool with no registration. No signup required.",
		url: "https://sopkit.github.io/pdf-unlocker",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free PDF Unlocker Online - No Signup | SopKit",
		description: "Manage, convert, edit, and secure PDF documents with our free PDF Unlocker online. Safe and private browser-based tool with no registration. No signup required.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/pdf-unlocker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PDFUnlock />
		</ToolLayout>
	);
}
