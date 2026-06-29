import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubeChannelIDFinderTool from "@/components/tools/youtube/YouTubeChannelIDFinderTool";

export const metadata = {
	title: "YouTube Video Statistics Online Free - No Signup | SopKit",
	description: "Get detailed metrics and statistics for any YouTube video instantly. Analyze view counts, likes, and engagement rates with our free online video audit tool. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-video-statistics/",
	},
	openGraph: {
		title: "YouTube Video Statistics Online Free - No Signup",
		description: "Get detailed metrics and statistics for any YouTube video instantly. Analyze view counts, likes, and engagement rates with our free online video audit tool. No ",
		url: "https://sopkit.github.io/youtube-video-statistics",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "YouTube Video Statistics Online Free - Fast & Secure",
		description: "Get detailed metrics and statistics for any YouTube video instantly. Analyze view counts, likes, and engagement rates with our free online video audit tool. No ",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-video-statistics");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<YouTubeChannelIDFinderTool />
		</ToolLayout>
	);
}
