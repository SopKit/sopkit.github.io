import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PDFRepair from "@/components/tools/pdf/PDFRepair";

export const metadata = {
	title: "Free PDF Repair Online - No Signup | SopKit",
	description: "Manage, convert, edit, and secure PDF documents with our free PDF Repair online. Safe and private browser-based tool with no registration. 100% free and secure.",
	keywords: "pdf repair, free online tool, no signup, pdf repair online, pdf, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/pdf-repair",
	},
	openGraph: {
		title: "Free PDF Repair Online - No Signup | SopKit",
		description: "Manage, convert, edit, and secure PDF documents with our free PDF Repair online. Safe and private browser-based tool with no registration. 100% free and secure.",
		url: "https://sopkit.github.io/pdf-repair",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free PDF Repair Online - No Signup | SopKit",
		description: "Manage, convert, edit, and secure PDF documents with our free PDF Repair online. Safe and private browser-based tool with no registration. 100% free and secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/pdf-repair");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PDFRepair />
		</ToolLayout>
	);
}
