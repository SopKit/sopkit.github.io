import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubeTitleCapitalizerTool from "@/components/tools/youtube/YouTubeTitleCapitalizerTool";

export const metadata = {
	title: "Free Youtube Video Title Capitalizer Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Youtube Video Title Capitalizer online. Fast, secure browser-based utility with no registration.",
	keywords: "youtube video title capitalizer, free online tool, no signup, youtube video title capitalizer online, youtube, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-title-capitalizer",
	},
	openGraph: {
		title: "Free Youtube Video Title Capitalizer Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Youtube Video Title Capitalizer online. Fast, secure browser-based utility with no registration.",
		url: "https://sopkit.github.io/youtube-title-capitalizer",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Youtube Video Title Capitalizer Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Youtube Video Title Capitalizer online. Fast, secure browser-based utility with no registration.",
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
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<YouTubeTitleCapitalizerTool />
		</ToolLayout>
	);
}
