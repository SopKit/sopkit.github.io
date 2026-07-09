import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubeChannelIDFinderTool from "@/components/tools/youtube/YouTubeChannelIDFinderTool";

export const metadata = {
	title: "YouTube Channel Statistics Online Free - No Signup | SopKit",
	description: "Get detailed insights and statistics for any YouTube channel instantly. View subscriber counts, video totals, and engagement metrics with our free online analytics tool. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-channel-statistics/",
	},
	openGraph: {
		title: "YouTube Channel Statistics Online Free - No Signup",
		description: "Get detailed insights and statistics for any YouTube channel instantly. View subscriber counts, video totals, and engagement metrics with our free online analyt",
		url: "https://sopkit.github.io/youtube-channel-statistics/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "YouTube Channel Statistics Online Free - Fast & Secure",
		description: "Get detailed insights and statistics for any YouTube channel instantly. View subscriber counts, video totals, and engagement metrics with our free online analyt",
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
