import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free Word Frequency Counter Online - No Signup | SopKit",
	description: "Format, clean, sort, and analyze text files instantly with our free Word Frequency Counter online. Fast and private browser utility with no signup. Easy to use.",
	keywords: "word frequency counter, free online tool, no signup, word frequency counter online, text, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/word-frequency-counter",
	},
	openGraph: {
		title: "Free Word Frequency Counter Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free Word Frequency Counter online. Fast and private browser utility with no signup. Easy to use.",
		url: "https://sopkit.github.io/word-frequency-counter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Word Frequency Counter Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free Word Frequency Counter online. Fast and private browser utility with no signup. Easy to use.",
		images: ["/og-image.jpg"],
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
