import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import CSSShadowTool from "@/components/tools/developer/CSSShadowTool";

export const metadata = {
	title: "CSS Shadow Generator Online Free - Developer Tools | SopKit",
	description: "Generate CSS box shadows and text shadows for modern web design. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/css-shadow-generator",
	},
	openGraph: {
		title: "CSS Shadow Generator Online Free - No Signup",
		description: "Generate CSS box shadows and text shadows for modern web design. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/css-shadow-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "CSS Shadow Generator Online Free - Fast & Secure",
		description: "Generate CSS box shadows and text shadows for modern web design. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/css-shadow-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<CSSShadowTool />
		</ToolLayout>
	);
}
