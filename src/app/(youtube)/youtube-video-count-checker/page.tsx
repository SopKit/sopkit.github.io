import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubeChannelIDFinderTool from "@/components/tools/youtube/YouTubeChannelIDFinderTool";

export const metadata = {
	title: "Free YouTube Video Count Checker Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free YouTube Video Count Checker online. Fast, secure browser-based utility with no registration. Easy to use.",
	keywords: "youtube video count checker, free online tool, no signup, youtube video count checker online, youtube, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-video-count-checker",
	},
	openGraph: {
		title: "Free YouTube Video Count Checker Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Video Count Checker online. Fast, secure browser-based utility with no registration. Easy to use.",
		url: "https://sopkit.github.io/youtube-video-count-checker",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free YouTube Video Count Checker Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Video Count Checker online. Fast, secure browser-based utility with no registration. Easy to use.",
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
