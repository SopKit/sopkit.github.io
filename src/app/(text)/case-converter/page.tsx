import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Free Case Converter (Sentence, Upper, Lower) Online - No Signup | SopKit",
	description: "Format, clean, sort, and analyze text files instantly with our free Case Converter (Sentence, Upper, Lower) online. Fast and private browser utility with no...",
	keywords: "case converter (sentence, upper, lower), free online tool, no signup, case converter (sentence, upper, lower) online, text, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/case-converter",
	},
	openGraph: {
		title: "Free Case Converter (Sentence, Upper, Lower) Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free Case Converter (Sentence, Upper, Lower) online. Fast and private browser utility with no...",
		url: "https://sopkit.github.io/case-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Case Converter (Sentence, Upper, Lower) Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free Case Converter (Sentence, Upper, Lower) online. Fast and private browser utility with no...",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/case-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
