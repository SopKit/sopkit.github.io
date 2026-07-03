import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "String Length Calculator - Free Character & Word Counter | SopKit",
	description: "Calculate string character length, word count, total bytes size, lines count, whitespaces count, and paragraphs instantly. Fully private text utility.",
	alternates: {
		canonical: "https://sopkit.github.io/string-length-calculator",
	},
	openGraph: {
		title: "String Length Calculator - Free Character & Word Counter | SopKit",
		description: "Calculate string character length, word count, total bytes size, lines count, whitespaces count, and paragraphs instantly. Fully private text utility.",
		url: "https://sopkit.github.io/string-length-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-images/text-tools.png" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "String Length Calculator - Free Character & Word Counter | SopKit",
		description: "Calculate string character length, word count, total bytes size, lines count, whitespaces count, and paragraphs instantly. Fully private text utility.",
		images: ["/og-images/text-tools.png"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/string-length-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
