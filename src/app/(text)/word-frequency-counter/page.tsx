import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Word Frequency Counter Online - Density Checker | SopKit",
	description: "Analyze word frequency and character density in your text. Get a sorted breakdown of how often each word is used. Perfect for writers and SEO audits.",
	alternates: {
		canonical: "https://sopkit.github.io/word-frequency-counter/",
	},
	openGraph: {
		title: "Word Frequency Counter Online - Density Checker | SopKit",
		description: "Analyze word frequency and character density in your text. Get a sorted breakdown of how often each word is used. Perfect for writers and SEO audits.",
		url: "https://sopkit.github.io/word-frequency-counter/",
		siteName: "SopKit",
		images: [{ url: "/og-images/text-tools.png" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Word Frequency Counter Online - Density Checker | SopKit",
		description: "Analyze word frequency and character density in your text. Get a sorted breakdown of how often each word is used. Perfect for writers and SEO audits.",
		images: ["/og-images/text-tools.png"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/word-frequency-counter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
