import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubeChannelIDFinderTool from "@/components/tools/youtube/YouTubeChannelIDFinderTool";

export const metadata = {
	title: "YouTube Title Length Checker Online Free - No Signup | SopKit",
	description: "Check if your YouTube video title is the optimal length for search and browse. Our free online checker helps you avoid truncation and ensure your full title is visible in search results. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-title-length-checker/",
	},
	openGraph: {
		title: "YouTube Title Length Checker Online Free - No Signup",
		description: "Check if your YouTube video title is the optimal length for search and browse. Our free online checker helps you avoid truncation and ensure your full title is ",
		url: "https://sopkit.github.io/youtube-title-length-checker/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "YouTube Title Length Checker Online Free - Fast & Secure",
		description: "Check if your YouTube video title is the optimal length for search and browse. Our free online checker helps you avoid truncation and ensure your full title is ",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-title-length-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<YouTubeChannelIDFinderTool />
		</ToolLayout>
	);
}
