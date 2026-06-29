import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import TextGeneratorTool from "@/components/tools/generators/TextGeneratorTool";

export const metadata = {
	title: "Excuse Generator Online Free - No Signup | SopKit",
	description: "Generate creative excuses for any situation. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/excuse-generator/",
	},
	openGraph: {
		title: "Excuse Generator Online Free - No Signup",
		description: "Generate creative excuses for any situation. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/excuse-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Excuse Generator Online Free - Fast & Secure",
		description: "Generate creative excuses for any situation. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/excuse-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<TextGeneratorTool />
		</ToolLayout>
	);
}
