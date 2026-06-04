import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import TextGeneratorTool from "@/components/tools/generators/TextGeneratorTool";

export const metadata = {
	title: "Poetry Generator Online Free - No Signup | SopKit",
	description: "Professional Poetry Generator tool for free online use. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/poetry-generator",
	},
	openGraph: {
		title: "Poetry Generator Online Free - No Signup",
		description: "Professional Poetry Generator tool for free online use. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/poetry-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Poetry Generator Online Free - Fast & Secure",
		description: "Professional Poetry Generator tool for free online use. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/poetry-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<TextGeneratorTool />
		</ToolLayout>
	);
}
