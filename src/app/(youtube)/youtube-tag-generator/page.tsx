import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubeChannelIDFinderTool from "@/components/tools/youtube/YouTubeChannelIDFinderTool";

export const metadata = {
	title: "YouTube Tag Generator Online Free - No Signup | SopKit",
	description: "Generate SEO-friendly tags for your YouTube videos instantly. Our free online tool suggests relevant keywords based on your video topic to help you rank higher in search results. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-tag-generator/",
	},
	openGraph: {
		title: "YouTube Tag Generator Online Free - No Signup",
		description: "Generate SEO-friendly tags for your YouTube videos instantly. Our free online tool suggests relevant keywords based on your video topic to help you rank higher ",
		url: "https://sopkit.github.io/youtube-tag-generator/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "YouTube Tag Generator Online Free - Fast & Secure",
		description: "Generate SEO-friendly tags for your YouTube videos instantly. Our free online tool suggests relevant keywords based on your video topic to help you rank higher ",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-tag-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<YouTubeChannelIDFinderTool />
		</ToolLayout>
	);
}
