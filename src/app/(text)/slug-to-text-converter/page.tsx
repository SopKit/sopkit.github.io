import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free Slug to Text Converter Online | SopKit",
	description: "Convert URL slugs with hyphens or underscores back into readable text strings. Support Title Case, Sentence Case, UPPERCASE, and lowercase formats instantly.",
	alternates: {
		canonical: "https://sopkit.github.io/slug-to-text-converter/",
	},
	openGraph: {
		title: "Free Slug to Text Converter Online | SopKit",
		description: "Convert URL slugs with hyphens or underscores back into readable text strings. Support Title Case, Sentence Case, UPPERCASE, and lowercase formats instantly.",
		url: "https://sopkit.github.io/slug-to-text-converter/",
		siteName: "SopKit",
		images: [{ url: "/og-images/text-tools.png" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Slug to Text Converter Online | SopKit",
		description: "Convert URL slugs with hyphens or underscores back into readable text strings. Support Title Case, Sentence Case, UPPERCASE, and lowercase formats instantly.",
		images: ["/og-images/text-tools.png"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/slug-to-text-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
