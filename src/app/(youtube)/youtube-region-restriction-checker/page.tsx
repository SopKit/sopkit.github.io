import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubeChannelIDFinderTool from "@/components/tools/youtube/YouTubeChannelIDFinderTool";

export const metadata = {
	title: "YouTube Region Restriction Checker Online Free - No Signup | SopKit",
	description: "Check if a YouTube video is blocked or restricted in specific countries instantly. Our free online tool helps you verify global availability for your content. Fast and accurate. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-region-restriction-checker/",
	},
	openGraph: {
		title: "YouTube Region Restriction Checker Online Free - No Signup",
		description: "Check if a YouTube video is blocked or restricted in specific countries instantly. Our free online tool helps you verify global availability for your content. F",
		url: "https://sopkit.github.io/youtube-region-restriction-checker/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "YouTube Region Restriction Checker Online Free - Fast & Secure",
		description: "Check if a YouTube video is blocked or restricted in specific countries instantly. Our free online tool helps you verify global availability for your content. F",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-region-restriction-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<YouTubeChannelIDFinderTool />
		</ToolLayout>
	);
}
