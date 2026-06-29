import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubeChannelIDFinderTool from "@/components/tools/youtube/YouTubeChannelIDFinderTool";

export const metadata = {
	title: "YouTube Video Count Checker Online Free - No Signup | SopKit",
	description: "Get the exact video count for any YouTube channel instantly. Our free online checker provides up-to-date information for competitive research and channel auditing. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-video-count-checker/",
	},
	openGraph: {
		title: "YouTube Video Count Checker Online Free - No Signup",
		description: "Get the exact video count for any YouTube channel instantly. Our free online checker provides up-to-date information for competitive research and channel auditi",
		url: "https://sopkit.github.io/youtube-video-count-checker",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "YouTube Video Count Checker Online Free - Fast & Secure",
		description: "Get the exact video count for any YouTube channel instantly. Our free online checker provides up-to-date information for competitive research and channel auditi",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-video-count-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<YouTubeChannelIDFinderTool />
		</ToolLayout>
	);
}
