import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import TextGeneratorTool from "@/components/tools/generators/TextGeneratorTool";

export const metadata = {
	title: "Free AI Poem Generator Online - No Signup | SopKit",
	description: "Create custom content with our free AI Poem Generator online. Generate high-quality outputs instantly with no registration required. 100% free and easy to use.",
	keywords: "ai poem generator, free online tool, no signup, ai poem generator online, generators, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/ai-poem-generator",
	},
	openGraph: {
		title: "Free AI Poem Generator Online - No Signup | SopKit",
		description: "Create custom content with our free AI Poem Generator online. Generate high-quality outputs instantly with no registration required. 100% free and easy to use.",
		url: "https://sopkit.github.io/ai-poem-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free AI Poem Generator Online - No Signup | SopKit",
		description: "Create custom content with our free AI Poem Generator online. Generate high-quality outputs instantly with no registration required. 100% free and easy to use.",
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
