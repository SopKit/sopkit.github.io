import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubeChannelIDFinderTool from "@/components/tools/youtube/YouTubeChannelIDFinderTool";

export const metadata = {
	title: "Free YouTube Views Ratio Calculator Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free YouTube Views Ratio Calculator online. Fast, secure browser-based utility with no registration. 100% free.",
	keywords: "youtube views ratio calculator, free online tool, no signup, youtube views ratio calculator online, youtube, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-views-ratio-calculator",
	},
	openGraph: {
		title: "Free YouTube Views Ratio Calculator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Views Ratio Calculator online. Fast, secure browser-based utility with no registration. 100% free.",
		url: "https://sopkit.github.io/youtube-views-ratio-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free YouTube Views Ratio Calculator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Views Ratio Calculator online. Fast, secure browser-based utility with no registration. 100% free.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-views-ratio-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<YouTubeChannelIDFinderTool />
		</ToolLayout>
	);
}
