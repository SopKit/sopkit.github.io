import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import JsonFormatterTool from "@/components/tools/code/JsonFormatterTool";

export const metadata = {
	title: "JSON Editor Online Free - Developer Tools | SopKit",
	description: "Edit, modify, and manage JSON data with our free online JSON Editor. Features syntax highlighting, tree view, and validation to help you structure your data perfectly. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/json-editor",
	},
	openGraph: {
		title: "JSON Editor Online Free - No Signup",
		description: "Edit, modify, and manage JSON data with our free online JSON Editor. Features syntax highlighting, tree view, and validation to help you structure your data per",
		url: "https://sopkit.github.io/json-editor",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "JSON Editor Online Free - Fast & Secure",
		description: "Edit, modify, and manage JSON data with our free online JSON Editor. Features syntax highlighting, tree view, and validation to help you structure your data per",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/json-editor");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<JsonFormatterTool />
		</ToolLayout>
	);
}
