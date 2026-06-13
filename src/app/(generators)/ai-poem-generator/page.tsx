import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import TextGeneratorTool from "@/components/tools/generators/TextGeneratorTool";

export const metadata = {
	title: "AI Poem Generator Online Free - No Signup | SopKit",
	description: "Create beautiful poems, haikus, and rhymes using artificial intelligence. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/ai-poem-generator",
	},
	openGraph: {
		title: "AI Poem Generator Online Free - No Signup",
		description: "Create beautiful poems, haikus, and rhymes using artificial intelligence. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/ai-poem-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "AI Poem Generator Online Free - Fast & Secure",
		description: "Create beautiful poems, haikus, and rhymes using artificial intelligence. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/ai-poem-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<TextGeneratorTool />
		</ToolLayout>
	);
}
