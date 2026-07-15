import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import TextGeneratorTool from "@/components/tools/generators/TextGeneratorTool";

export const metadata = {
	title: "Free Business Name Generator Online - No Signup | SopKit",
	description: "Create custom content with our free Business Name Generator online. Generate high-quality outputs instantly with no registration required. 100% free and secure.",
	keywords: "business name generator, free online tool, no signup, business name generator online, generators, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/business-name-generator",
	},
	openGraph: {
		title: "Free Business Name Generator Online - No Signup | SopKit",
		description: "Create custom content with our free Business Name Generator online. Generate high-quality outputs instantly with no registration required. 100% free and secure.",
		url: "https://sopkit.github.io/business-name-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Business Name Generator Online - No Signup | SopKit",
		description: "Create custom content with our free Business Name Generator online. Generate high-quality outputs instantly with no registration required. 100% free and secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/business-name-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<TextGeneratorTool />
		</ToolLayout>
	);
}
