import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Free Emoji Text Generator Online - No Signup | SopKit",
	description: "Format, clean, sort, and analyze text files instantly with our free Emoji Text Generator online. Fast and private browser utility with no signup. Free & secure.",
	keywords: "emoji text generator, free online tool, no signup, emoji text generator online, text, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/emoji-text-generator",
	},
	openGraph: {
		title: "Free Emoji Text Generator Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free Emoji Text Generator online. Fast and private browser utility with no signup. Free & secure.",
		url: "https://sopkit.github.io/emoji-text-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Emoji Text Generator Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free Emoji Text Generator online. Fast and private browser utility with no signup. Free & secure.",
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
