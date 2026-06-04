import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import YouTubeChannelIDFinderTool from "@/components/tools/youtube/YouTubeChannelIDFinderTool";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free YouTube Channel Age Checker Online - No Signup | SopKit",
	description: "Find the exact creation date of any YouTube channel with our free online Age Checker. Perfect for creator research, account verification, and competitive...",
	keywords: "youtube channel age checker, free online tool, no signup, youtube-channel-age-checker, free youtube-channel-age-checker, Youtube Channel Age Checker online, YouTube tool, free YouTube utility, YouTube optimizer, video analytics, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-channel-age-checker",
	},
	openGraph: {
		title: "Free YouTube Channel Age Checker Online - No Signup | SopKit",
		description: "Find the exact creation date of any YouTube channel with our free online Age Checker. Perfect for creator research, account verification, and competitive...",
		url: "https://sopkit.github.io/youtube-channel-age-checker",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free YouTube Channel Age Checker Online - No Signup | SopKit",
		description: "Find the exact creation date of any YouTube channel with our free online Age Checker. Perfect for creator research, account verification, and competitive...",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-channel-age-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<YouTubeChannelIDFinderTool />
		</ToolLayout>
	);
}
