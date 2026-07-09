import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubeChannelIDFinderTool from "@/components/tools/youtube/YouTubeChannelIDFinderTool";

export const metadata = {
	title: "YouTube Comment Picker Online Free - No Signup | SopKit",
	description: "Pick a random winner from your YouTube video comments instantly. Our free online Comment Picker is perfect for giveaways, contests, and audience engagement. Fast and fair. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-comment-picker/",
	},
	openGraph: {
		title: "YouTube Comment Picker Online Free - No Signup",
		description: "Pick a random winner from your YouTube video comments instantly. Our free online Comment Picker is perfect for giveaways, contests, and audience engagement. Fas",
		url: "https://sopkit.github.io/youtube-comment-picker/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "YouTube Comment Picker Online Free - Fast & Secure",
		description: "Pick a random winner from your YouTube video comments instantly. Our free online Comment Picker is perfect for giveaways, contests, and audience engagement. Fas",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-comment-picker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<YouTubeChannelIDFinderTool />
		</ToolLayout>
	);
}
