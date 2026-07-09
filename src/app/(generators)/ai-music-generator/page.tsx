import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import AIMusicGeneratorTool from "@/components/tools/generators/AIMusicGeneratorTool";

export const metadata = {
	title: "AI Music Generator Online Free - No Signup | SopKit",
	description: "Generate full-length AI songs with vocals and instrumentation from text prompts using MiniMax Music 2.6 on Cloudflare AI. Royalty-free music generation with studio-grade quality. Free this week! No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/ai-music-generator/",
	},
	openGraph: {
		title: "AI Music Generator Online Free - No Signup",
		description: "Generate full-length AI songs with vocals and instrumentation from text prompts using MiniMax Music 2.6 on Cloudflare AI. Royalty-free music generation with stu",
		url: "https://sopkit.github.io/ai-music-generator/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "AI Music Generator Online Free - Fast & Secure",
		description: "Generate full-length AI songs with vocals and instrumentation from text prompts using MiniMax Music 2.6 on Cloudflare AI. Royalty-free music generation with stu",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/ai-music-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<AIMusicGeneratorTool />
		</ToolLayout>
	);
}
