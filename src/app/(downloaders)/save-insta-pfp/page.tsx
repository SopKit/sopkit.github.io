import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import InstagramDPDownloader from "@/components/tools/downloaders/InstagramDPDownloader";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Save Insta Profile Picture",
	description: "Private Save Insta Profile Picture: privately download videos entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/save-insta-pfp",
	category: "video",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/save-insta-pfp");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<InstagramDPDownloader />
		</ToolLayout>
	);
}
