import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import WordToPDF from "@/components/tools/pdf/WordToPDF";

export const metadata = {
	title: "Word to PDF Online Free - Edit, Merge & Convert PDF | SopKit",
	description: "Convert Word documents (.docx) to high-quality PDF files online for free. Privacy-first, browser-based conversion with no signup required. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/word-to-pdf/",
	},
	openGraph: {
		title: "Word to PDF Online Free - No Signup",
		description: "Convert Word documents (.docx) to high-quality PDF files online for free. Privacy-first, browser-based conversion with no signup required. No signup, no uploads",
		url: "https://sopkit.github.io/word-to-pdf",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Word to PDF Online Free - Fast & Secure",
		description: "Convert Word documents (.docx) to high-quality PDF files online for free. Privacy-first, browser-based conversion with no signup required. No signup, no uploads",
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
