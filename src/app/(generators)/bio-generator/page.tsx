import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import TextGeneratorTool from "@/components/tools/generators/TextGeneratorTool";

export const metadata = {
	title: "Free Bio Generator Online - No Signup | SopKit",
	description: "Create custom content with our free Bio Generator online. Generate high-quality outputs instantly with no registration required. 100% free and easy to use.",
	keywords: "bio generator, free online tool, no signup, bio generator online, generators, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/bio-generator",
	},
	openGraph: {
		title: "Free Bio Generator Online - No Signup | SopKit",
		description: "Create custom content with our free Bio Generator online. Generate high-quality outputs instantly with no registration required. 100% free and easy to use.",
		url: "https://sopkit.github.io/bio-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Bio Generator Online - No Signup | SopKit",
		description: "Create custom content with our free Bio Generator online. Generate high-quality outputs instantly with no registration required. 100% free and easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/bio-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<TextGeneratorTool />
		</ToolLayout>
	);
}
