import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubeChannelIDFinderTool from "@/components/tools/youtube/YouTubeChannelIDFinderTool";

export const metadata = {
	title: "Free YouTube Comment Picker Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free YouTube Comment Picker online. Fast, secure browser-based utility with no registration. Try it free now.",
	keywords: "youtube comment picker, free online tool, no signup, youtube comment picker online, youtube, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-comment-picker",
	},
	openGraph: {
		title: "Free YouTube Comment Picker Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Comment Picker online. Fast, secure browser-based utility with no registration. Try it free now.",
		url: "https://sopkit.github.io/youtube-comment-picker",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free YouTube Comment Picker Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Comment Picker online. Fast, secure browser-based utility with no registration. Try it free now.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-comment-picker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<YouTubeChannelIDFinderTool />
		</ToolLayout>
	);
}
