import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Emoji Text Generator Online Free | SopKit",
	description: "Add fun emojis to your text or convert words into emoji-rich messages for social media. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/emoji-text-generator/",
	},
	openGraph: {
		title: "Emoji Text Generator Online Free - No Signup | SopKit",
		description: "Add fun emojis to your text or convert words into emoji-rich messages for social media. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/emoji-text-generator/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Emoji Text Generator Online Free - Fast & Secure",
		description: "Add fun emojis to your text or convert words into emoji-rich messages for social media. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/emoji-text-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
