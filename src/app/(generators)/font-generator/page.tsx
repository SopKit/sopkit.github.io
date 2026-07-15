import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import FontGeneratorTool from "@/components/tools/generators/FontGeneratorTool";

export const metadata = {
	title: "Free Font Generator Online - No Signup | SopKit",
	description: "Create custom content with our free Font Generator online. Generate high-quality outputs instantly with no registration required. 100% free and easy to use.",
	keywords: "font generator, free online tool, no signup, font generator online, generators, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/font-generator",
	},
	openGraph: {
		title: "Free Font Generator Online - No Signup | SopKit",
		description: "Create custom content with our free Font Generator online. Generate high-quality outputs instantly with no registration required. 100% free and easy to use.",
		url: "https://sopkit.github.io/font-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Font Generator Online - No Signup | SopKit",
		description: "Create custom content with our free Font Generator online. Generate high-quality outputs instantly with no registration required. 100% free and easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/font-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<FontGeneratorTool />
		</ToolLayout>
	);
}
