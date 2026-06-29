import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubeChannelIDFinderTool from "@/components/tools/youtube/YouTubeChannelIDFinderTool";

export const metadata = {
	title: "YouTube Money Calculator Online Free - No Signup | SopKit",
	description: "Estimate potential earnings for any YouTube video or channel with our free online Money Calculator. Understand revenue based on views, CPM, and engagement metrics. Perfect for creators. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-money-calculator/",
	},
	openGraph: {
		title: "YouTube Money Calculator Online Free - No Signup",
		description: "Estimate potential earnings for any YouTube video or channel with our free online Money Calculator. Understand revenue based on views, CPM, and engagement metri",
		url: "https://sopkit.github.io/youtube-money-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "YouTube Money Calculator Online Free - Fast & Secure",
		description: "Estimate potential earnings for any YouTube video or channel with our free online Money Calculator. Understand revenue based on views, CPM, and engagement metri",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-money-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<YouTubeChannelIDFinderTool />
		</ToolLayout>
	);
}
