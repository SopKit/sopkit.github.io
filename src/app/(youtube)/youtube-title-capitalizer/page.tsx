import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubeChannelIDFinderTool from "@/components/tools/youtube/YouTubeChannelIDFinderTool";

export const metadata = {
	title: "Youtube Video Title Capitalizer Online Free - No Signup | SopKit",
	description: "Automatically capitalize your YouTube video titles for maximum professional impact and CTR. Our free online tool follows industry standards to make your titles stand out. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-title-capitalizer",
	},
	openGraph: {
		title: "Youtube Video Title Capitalizer Online Free - No Signup",
		description: "Automatically capitalize your YouTube video titles for maximum professional impact and CTR. Our free online tool follows industry standards to make your titles ",
		url: "https://sopkit.github.io/youtube-title-capitalizer",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Youtube Video Title Capitalizer Online Free - Fast & Secure",
		description: "Automatically capitalize your YouTube video titles for maximum professional impact and CTR. Our free online tool follows industry standards to make your titles ",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-title-capitalizer");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<YouTubeChannelIDFinderTool />
		</ToolLayout>
	);
}
