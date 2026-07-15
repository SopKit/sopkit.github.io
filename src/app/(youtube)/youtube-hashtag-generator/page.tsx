import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubeChannelIDFinderTool from "@/components/tools/youtube/YouTubeChannelIDFinderTool";

export const metadata = {
	title: "Free YouTube Hashtag Generator Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free YouTube Hashtag Generator online. Fast, secure browser-based utility with no registration. Free & secure.",
	keywords: "youtube hashtag generator, free online tool, no signup, youtube hashtag generator online, youtube, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-hashtag-generator",
	},
	openGraph: {
		title: "Free YouTube Hashtag Generator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Hashtag Generator online. Fast, secure browser-based utility with no registration. Free & secure.",
		url: "https://sopkit.github.io/youtube-hashtag-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free YouTube Hashtag Generator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Hashtag Generator online. Fast, secure browser-based utility with no registration. Free & secure.",
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
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<YouTubeChannelIDFinderTool />
		</ToolLayout>
	);
}
