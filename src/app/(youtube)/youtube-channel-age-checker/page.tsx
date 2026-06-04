import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubeChannelIDFinderTool from "@/components/tools/youtube/YouTubeChannelIDFinderTool";

export const metadata = {
	title: "YouTube Channel Age Checker Online Free - No Signup | SopKit",
	description: "Find the exact creation date of any YouTube channel with our free online Age Checker. Perfect for creator research, account verification, and competitive analysis. Fast and private. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-channel-age-checker",
	},
	openGraph: {
		title: "YouTube Channel Age Checker Online Free - No Signup",
		description: "Find the exact creation date of any YouTube channel with our free online Age Checker. Perfect for creator research, account verification, and competitive analys",
		url: "https://sopkit.github.io/youtube-channel-age-checker",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "YouTube Channel Age Checker Online Free - Fast & Secure",
		description: "Find the exact creation date of any YouTube channel with our free online Age Checker. Perfect for creator research, account verification, and competitive analys",
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
