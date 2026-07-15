import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubeChannelIDFinderTool from "@/components/tools/youtube/YouTubeChannelIDFinderTool";

export const metadata = {
	title: "Free YouTube Channel Statistics Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free YouTube Channel Statistics online. Fast, secure browser-based utility with no registration. Free & secure.",
	keywords: "youtube channel statistics, free online tool, no signup, youtube channel statistics online, youtube, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-channel-statistics",
	},
	openGraph: {
		title: "Free YouTube Channel Statistics Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Channel Statistics online. Fast, secure browser-based utility with no registration. Free & secure.",
		url: "https://sopkit.github.io/youtube-channel-statistics",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free YouTube Channel Statistics Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Channel Statistics online. Fast, secure browser-based utility with no registration. Free & secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-channel-statistics");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<YouTubeChannelIDFinderTool />
		</ToolLayout>
	);
}
