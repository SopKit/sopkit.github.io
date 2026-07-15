import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ImageToPDF from "@/components/tools/pdf/ImageToPDF";

export const metadata = {
	title: "Free Image to PDF Online - No Signup | SopKit",
	description: "Manage, convert, edit, and secure PDF documents with our free Image to PDF online. Safe and private browser-based tool with no registration. No signup required.",
	keywords: "image to pdf, free online tool, no signup, image to pdf online, pdf, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/image-to-pdf",
	},
	openGraph: {
		title: "Free Image to PDF Online - No Signup | SopKit",
		description: "Manage, convert, edit, and secure PDF documents with our free Image to PDF online. Safe and private browser-based tool with no registration. No signup required.",
		url: "https://sopkit.github.io/image-to-pdf",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Image to PDF Online - No Signup | SopKit",
		description: "Manage, convert, edit, and secure PDF documents with our free Image to PDF online. Safe and private browser-based tool with no registration. No signup required.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/image-to-pdf");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ImageToPDF />
		</ToolLayout>
	);
}
