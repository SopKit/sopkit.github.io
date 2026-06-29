import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubeChannelIDFinderTool from "@/components/tools/youtube/YouTubeChannelIDFinderTool";

export const metadata = {
	title: "YouTube Channel Finder Online Free - No Signup | SopKit",
	description: "Discover YouTube channels by keyword, category, or topic instantly. Our free online Channel Finder helps you research competitors and find inspiration for your next video project. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-channel-finder/",
	},
	openGraph: {
		title: "YouTube Channel Finder Online Free - No Signup",
		description: "Discover YouTube channels by keyword, category, or topic instantly. Our free online Channel Finder helps you research competitors and find inspiration for your ",
		url: "https://sopkit.github.io/youtube-channel-finder",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "YouTube Channel Finder Online Free - Fast & Secure",
		description: "Discover YouTube channels by keyword, category, or topic instantly. Our free online Channel Finder helps you research competitors and find inspiration for your ",
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
