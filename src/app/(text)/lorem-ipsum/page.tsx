import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import LoremIpsumGeneratorTool from "@/components/tools/generators/LoremIpsumGeneratorTool";

export const metadata = {
	title: "Lorem Ipsum Generator Online Free - No Signup | SopKit",
	description: "Generate custom Lorem Ipsum text for your designs. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/lorem-ipsum",
	},
	openGraph: {
		title: "Lorem Ipsum Generator Online Free - No Signup",
		description: "Generate custom Lorem Ipsum text for your designs. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/lorem-ipsum",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Lorem Ipsum Generator Online Free - Fast & Secure",
		description: "Generate custom Lorem Ipsum text for your designs. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/lorem-ipsum");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<LoremIpsumGeneratorTool />
		</ToolLayout>
	);
}
