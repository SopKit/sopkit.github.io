import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubeChannelIDFinderTool from "@/components/tools/youtube/YouTubeChannelIDFinderTool";

export const metadata = {
	title: "YouTube Hashtag Generator Online Free - No Signup | SopKit",
	description: "Generate viral hashtags for your YouTube videos instantly. Our free online tool suggests relevant, search-friendly tags to help you reach more viewers and boost engagement. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-hashtag-generator",
	},
	openGraph: {
		title: "YouTube Hashtag Generator Online Free - No Signup",
		description: "Generate viral hashtags for your YouTube videos instantly. Our free online tool suggests relevant, search-friendly tags to help you reach more viewers and boost",
		url: "https://sopkit.github.io/youtube-hashtag-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "YouTube Hashtag Generator Online Free - Fast & Secure",
		description: "Generate viral hashtags for your YouTube videos instantly. Our free online tool suggests relevant, search-friendly tags to help you reach more viewers and boost",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-hashtag-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<YouTubeChannelIDFinderTool />
		</ToolLayout>
	);
}
