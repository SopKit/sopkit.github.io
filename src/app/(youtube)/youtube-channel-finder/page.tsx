import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubeChannelIDFinderTool from "@/components/tools/youtube/YouTubeChannelIDFinderTool";

export const metadata = {
	title: "Free YouTube Channel Finder Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free YouTube Channel Finder online. Fast, secure browser-based utility with no registration. Try it free now.",
	keywords: "youtube channel finder, free online tool, no signup, youtube channel finder online, youtube, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-channel-finder",
	},
	openGraph: {
		title: "Free YouTube Channel Finder Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Channel Finder online. Fast, secure browser-based utility with no registration. Try it free now.",
		url: "https://sopkit.github.io/youtube-channel-finder",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free YouTube Channel Finder Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Channel Finder online. Fast, secure browser-based utility with no registration. Try it free now.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-channel-finder");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<YouTubeChannelIDFinderTool />
		</ToolLayout>
	);
}
