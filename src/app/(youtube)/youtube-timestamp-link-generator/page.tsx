import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubeTimestampLinkGeneratorTool from "@/components/tools/youtube/YouTubeTimestampLinkGeneratorTool";

export const metadata = {
	title: "Free YouTube Timestamp Link Generator Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free YouTube Timestamp Link Generator online. Fast, secure browser-based utility with no registration.",
	keywords: "youtube timestamp link generator, free online tool, no signup, youtube timestamp link generator online, youtube, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-timestamp-link-generator",
	},
	openGraph: {
		title: "Free YouTube Timestamp Link Generator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Timestamp Link Generator online. Fast, secure browser-based utility with no registration.",
		url: "https://sopkit.github.io/youtube-timestamp-link-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free YouTube Timestamp Link Generator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Timestamp Link Generator online. Fast, secure browser-based utility with no registration.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-timestamp-link-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<YouTubeTimestampLinkGeneratorTool />
		</ToolLayout>
	);
}
