import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Number to Words Converter Online Free | SopKit",
	description: "Convert any number into words (English, Indian numbering system) for cheques, invoices, and documents. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/number-to-words-converter/",
	},
	openGraph: {
		title: "Number to Words Converter Online Free - No Signup | SopKit",
		description: "Convert any number into words (English, Indian numbering system) for cheques, invoices, and documents. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/number-to-words-converter/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Number to Words Converter Online Free - Fast & Secure",
		description: "Convert any number into words (English, Indian numbering system) for cheques, invoices, and documents. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/number-to-words-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
