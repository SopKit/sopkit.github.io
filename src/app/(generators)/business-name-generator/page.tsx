import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import TextGeneratorTool from "@/components/tools/generators/TextGeneratorTool";

export const metadata = {
	title: "Business Name Generator Online Free - No Signup | SopKit",
	description: "Generate creative and catchy names for your brand or startup. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/business-name-generator",
	},
	openGraph: {
		title: "Business Name Generator Online Free - No Signup",
		description: "Generate creative and catchy names for your brand or startup. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/business-name-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Business Name Generator Online Free - Fast & Secure",
		description: "Generate creative and catchy names for your brand or startup. No signup, no uploads, 100% private browser-based tool.",
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
