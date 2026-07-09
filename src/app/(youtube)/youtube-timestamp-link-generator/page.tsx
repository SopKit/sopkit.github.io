import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubeChannelIDFinderTool from "@/components/tools/youtube/YouTubeChannelIDFinderTool";

export const metadata = {
	title: "YouTube Timestamp Link Generator Online Free - No Signup | SopKit",
	description: "Create direct links to specific parts of any YouTube video instantly. Our free online tool helps you share precise moments with friends, students, or your audience. Fast and easy. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-timestamp-link-generator/",
	},
	openGraph: {
		title: "YouTube Timestamp Link Generator Online Free - No Signup",
		description: "Create direct links to specific parts of any YouTube video instantly. Our free online tool helps you share precise moments with friends, students, or your audie",
		url: "https://sopkit.github.io/youtube-timestamp-link-generator/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "YouTube Timestamp Link Generator Online Free - Fast & Secure",
		description: "Create direct links to specific parts of any YouTube video instantly. Our free online tool helps you share precise moments with friends, students, or your audie",
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
			<YouTubeChannelIDFinderTool />
		</ToolLayout>
	);
}
