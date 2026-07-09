import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "XML Formatter & Beautifier Online Free | SopKit",
	description: "Clean and format messy XML data into a readable hierarchical structure. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/xml-formatter/",
	},
	openGraph: {
		title: "XML Formatter & Beautifier Online Free - No Signup | SopKit",
		description: "Clean and format messy XML data into a readable hierarchical structure. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/xml-formatter/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "XML Formatter & Beautifier Online Free - Fast & Secure",
		description: "Clean and format messy XML data into a readable hierarchical structure. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/xml-formatter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
