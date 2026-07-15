import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free YAML to JSON Converter Online - No Signup | SopKit",
	description: "Format, minify, validate, and convert code snippets with our free YAML to JSON Converter online. Secure, local developer utility with no registration.",
	keywords: "yaml to json converter, free online tool, no signup, yaml to json converter online, developer, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/yaml-to-json-converter",
	},
	openGraph: {
		title: "Free YAML to JSON Converter Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free YAML to JSON Converter online. Secure, local developer utility with no registration.",
		url: "https://sopkit.github.io/yaml-to-json-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free YAML to JSON Converter Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free YAML to JSON Converter online. Secure, local developer utility with no registration.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/yaml-to-json-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
