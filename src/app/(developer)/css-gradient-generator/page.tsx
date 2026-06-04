import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import CSSGradientTool from "@/components/tools/developer/CSSGradientTool";

export const metadata = {
	title: "CSS Gradient Generator Online Free - Developer Tools | SopKit",
	description: "Create beautiful CSS gradients for your web projects. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/css-gradient-generator",
	},
	openGraph: {
		title: "CSS Gradient Generator Online Free - No Signup",
		description: "Create beautiful CSS gradients for your web projects. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/css-gradient-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "CSS Gradient Generator Online Free - Fast & Secure",
		description: "Create beautiful CSS gradients for your web projects. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/css-gradient-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<CSSGradientTool />
		</ToolLayout>
	);
}
