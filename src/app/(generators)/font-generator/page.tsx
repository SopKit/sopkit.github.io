import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import FontGeneratorTool from "@/components/tools/generators/FontGeneratorTool";

export const metadata = {
	title: "Font Generator Online Free - No Signup | SopKit",
	description: "Professional Font Generator tool for free online use. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/font-generator",
	},
	openGraph: {
		title: "Font Generator Online Free - No Signup",
		description: "Professional Font Generator tool for free online use. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/font-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Font Generator Online Free - Fast & Secure",
		description: "Professional Font Generator tool for free online use. No signup, no uploads, 100% private browser-based tool.",
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
