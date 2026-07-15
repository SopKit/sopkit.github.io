import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import CSSGradientTool from "@/components/tools/developer/CSSGradientTool";

export const metadata = {
	title: "Free CSS Gradient Generator Online - No Signup | SopKit",
	description: "Format, minify, validate, and convert code snippets with our free CSS Gradient Generator online. Secure, local developer utility with no registration.",
	keywords: "css gradient generator, free online tool, no signup, css gradient generator online, developer, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/css-gradient-generator",
	},
	openGraph: {
		title: "Free CSS Gradient Generator Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free CSS Gradient Generator online. Secure, local developer utility with no registration.",
		url: "https://sopkit.github.io/css-gradient-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free CSS Gradient Generator Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free CSS Gradient Generator online. Secure, local developer utility with no registration.",
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
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<CSSGradientTool />
		</ToolLayout>
	);
}
