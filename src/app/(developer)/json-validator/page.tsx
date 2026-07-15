import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import JsonFormatterTool from "@/components/tools/code/JsonFormatterTool";

export const metadata = {
	title: "Free JSON Validator Online - No Signup | SopKit",
	description: "Format, minify, validate, and convert code snippets with our free JSON Validator online. Secure, local developer utility with no registration. Try it free now.",
	keywords: "json validator, free online tool, no signup, json validator online, developer, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/json-validator",
	},
	openGraph: {
		title: "Free JSON Validator Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free JSON Validator online. Secure, local developer utility with no registration. Try it free now.",
		url: "https://sopkit.github.io/json-validator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free JSON Validator Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free JSON Validator online. Secure, local developer utility with no registration. Try it free now.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/json-validator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<JsonFormatterTool />
		</ToolLayout>
	);
}
