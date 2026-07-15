import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free JSON to YAML Converter Online - No Signup | SopKit",
	description: "Format, minify, validate, and convert code snippets with our free JSON to YAML Converter online. Secure, local developer utility with no registration.",
	keywords: "json to yaml converter, free online tool, no signup, json to yaml converter online, developer, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/json-to-yaml-converter",
	},
	openGraph: {
		title: "Free JSON to YAML Converter Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free JSON to YAML Converter online. Secure, local developer utility with no registration.",
		url: "https://sopkit.github.io/json-to-yaml-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free JSON to YAML Converter Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free JSON to YAML Converter online. Secure, local developer utility with no registration.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/json-to-yaml-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
