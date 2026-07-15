import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubeChannelIDFinderTool from "@/components/tools/youtube/YouTubeChannelIDFinderTool";

export const metadata = {
	title: "Free YouTube Tag Generator Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free YouTube Tag Generator online. Fast, secure browser-based utility with no registration. No signup required.",
	keywords: "youtube tag generator, free online tool, no signup, youtube tag generator online, youtube, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-tag-generator",
	},
	openGraph: {
		title: "Free YouTube Tag Generator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Tag Generator online. Fast, secure browser-based utility with no registration. No signup required.",
		url: "https://sopkit.github.io/youtube-tag-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free YouTube Tag Generator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Tag Generator online. Fast, secure browser-based utility with no registration. No signup required.",
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
