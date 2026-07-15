import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import WordToPDF from "@/components/tools/pdf/WordToPDF";

export const metadata = {
	title: "Free Word to PDF Online - No Signup | SopKit",
	description: "Manage, convert, edit, and secure PDF documents with our free Word to PDF online. Safe and private browser-based tool with no registration. No signup required.",
	keywords: "word to pdf, free online tool, no signup, word to pdf online, pdf, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/word-to-pdf",
	},
	openGraph: {
		title: "Free Word to PDF Online - No Signup | SopKit",
		description: "Manage, convert, edit, and secure PDF documents with our free Word to PDF online. Safe and private browser-based tool with no registration. No signup required.",
		url: "https://sopkit.github.io/word-to-pdf",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Word to PDF Online - No Signup | SopKit",
		description: "Manage, convert, edit, and secure PDF documents with our free Word to PDF online. Safe and private browser-based tool with no registration. No signup required.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/word-to-pdf");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<WordToPDF />
		</ToolLayout>
	);
}
