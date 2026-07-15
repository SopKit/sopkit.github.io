import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubeSubscribeLinkGeneratorTool from "@/components/tools/youtube/YouTubeSubscribeLinkGeneratorTool";

export const metadata = {
	title: "Free YouTube Subscribe Link Generator Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free YouTube Subscribe Link Generator online. Fast, secure browser-based utility with no registration.",
	keywords: "youtube subscribe link generator, free online tool, no signup, youtube subscribe link generator online, youtube, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-subscribe-link-generator",
	},
	openGraph: {
		title: "Free YouTube Subscribe Link Generator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Subscribe Link Generator online. Fast, secure browser-based utility with no registration.",
		url: "https://sopkit.github.io/youtube-subscribe-link-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free YouTube Subscribe Link Generator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Subscribe Link Generator online. Fast, secure browser-based utility with no registration.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-subscribe-link-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<YouTubeSubscribeLinkGeneratorTool />
		</ToolLayout>
	);
}
