import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubeChannelIDFinderTool from "@/components/tools/youtube/YouTubeChannelIDFinderTool";

export const metadata = {
	title: "Free YouTube Region Restriction Checker Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free YouTube Region Restriction Checker online. Fast, secure browser-based utility with no registration.",
	keywords: "youtube region restriction checker, free online tool, no signup, youtube region restriction checker online, youtube, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-region-restriction-checker",
	},
	openGraph: {
		title: "Free YouTube Region Restriction Checker Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Region Restriction Checker online. Fast, secure browser-based utility with no registration.",
		url: "https://sopkit.github.io/youtube-region-restriction-checker",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free YouTube Region Restriction Checker Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Region Restriction Checker online. Fast, secure browser-based utility with no registration.",
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
