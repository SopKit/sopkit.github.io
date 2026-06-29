import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubeChannelIDFinderTool from "@/components/tools/youtube/YouTubeChannelIDFinderTool";

export const metadata = {
	title: "YouTube Embed Code Generator Online Free - No Signup | SopKit",
	description: "Generate customizable YouTube embed codes instantly. Our free online tool helps you create responsive iframes with specific start times, player controls, and privacy settings for your website. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-embed-code-generator/",
	},
	openGraph: {
		title: "YouTube Embed Code Generator Online Free - No Signup",
		description: "Generate customizable YouTube embed codes instantly. Our free online tool helps you create responsive iframes with specific start times, player controls, and pr",
		url: "https://sopkit.github.io/youtube-embed-code-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "YouTube Embed Code Generator Online Free - Fast & Secure",
		description: "Generate customizable YouTube embed codes instantly. Our free online tool helps you create responsive iframes with specific start times, player controls, and pr",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-embed-code-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<YouTubeChannelIDFinderTool />
		</ToolLayout>
	);
}
