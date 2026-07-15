import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import CSSShadowTool from "@/components/tools/developer/CSSShadowTool";

export const metadata = {
	title: "Free CSS Shadow Generator Online - No Signup | SopKit",
	description: "Format, minify, validate, and convert code snippets with our free CSS Shadow Generator online. Secure, local developer utility with no registration. 100% free.",
	keywords: "css shadow generator, free online tool, no signup, css shadow generator online, developer, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/css-shadow-generator",
	},
	openGraph: {
		title: "Free CSS Shadow Generator Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free CSS Shadow Generator online. Secure, local developer utility with no registration. 100% free.",
		url: "https://sopkit.github.io/css-shadow-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free CSS Shadow Generator Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free CSS Shadow Generator online. Secure, local developer utility with no registration. 100% free.",
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
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<CSSShadowTool />
		</ToolLayout>
	);
}
