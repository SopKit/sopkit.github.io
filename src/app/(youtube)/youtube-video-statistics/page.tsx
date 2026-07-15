import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubeChannelIDFinderTool from "@/components/tools/youtube/YouTubeChannelIDFinderTool";

export const metadata = {
	title: "Free YouTube Video Statistics Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free YouTube Video Statistics online. Fast, secure browser-based utility with no registration. Try it free now.",
	keywords: "youtube video statistics, free online tool, no signup, youtube video statistics online, youtube, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-video-statistics",
	},
	openGraph: {
		title: "Free YouTube Video Statistics Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Video Statistics online. Fast, secure browser-based utility with no registration. Try it free now.",
		url: "https://sopkit.github.io/youtube-video-statistics",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free YouTube Video Statistics Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Video Statistics online. Fast, secure browser-based utility with no registration. Try it free now.",
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
