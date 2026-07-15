import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import JSONToSchemaTool from "@/components/tools/developer/JSONToSchemaTool";

export const metadata = {
	title: "Free JSON to JSON Schema Online - No Signup | SopKit",
	description: "Format, minify, validate, and convert code snippets with our free JSON to JSON Schema online. Secure, local developer utility with no registration. Easy to use.",
	keywords: "json to json schema, free online tool, no signup, json to json schema online, developer, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/json-to-json-schema",
	},
	openGraph: {
		title: "Free JSON to JSON Schema Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free JSON to JSON Schema online. Secure, local developer utility with no registration. Easy to use.",
		url: "https://sopkit.github.io/json-to-json-schema",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free JSON to JSON Schema Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free JSON to JSON Schema online. Secure, local developer utility with no registration. Easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/json-to-json-schema");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<JSONToSchemaTool />
		</ToolLayout>
	);
}
