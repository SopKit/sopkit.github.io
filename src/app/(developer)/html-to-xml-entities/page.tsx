import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free HTML to XML Entities Converter Online | SopKit",
	description: "Convert HTML special characters into XML entities (like &amp;lt; and &amp;gt;) instantly. Escape and unescape code segments safely. Privacy-first browser tool.",
	alternates: {
		canonical: "https://sopkit.github.io/html-to-xml-entities/",
	},
	openGraph: {
		title: "Free HTML to XML Entities Converter Online | SopKit",
		description: "Convert HTML special characters into XML entities (like &amp;lt; and &amp;gt;) instantly. Escape and unescape code segments safely. Privacy-first browser tool.",
		url: "https://sopkit.github.io/html-to-xml-entities/",
		siteName: "SopKit",
		images: [{ url: "/og-images/developer-tools.png" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free HTML to XML Entities Converter Online | SopKit",
		description: "Convert HTML special characters into XML entities (like &amp;lt; and &amp;gt;) instantly. Escape and unescape code segments safely. Privacy-first browser tool.",
		images: ["/og-images/developer-tools.png"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/html-to-xml-entities");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
