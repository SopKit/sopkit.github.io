import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "JSON to TypeScript Interface Online Free | SopKit",
	description: "Convert JSON objects into clean TypeScript interfaces or type definitions automatically. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/json-to-typescript",
	},
	openGraph: {
		title: "JSON to TypeScript Interface Online Free - No Signup | SopKit",
		description: "Convert JSON objects into clean TypeScript interfaces or type definitions automatically. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/json-to-typescript/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "JSON to TypeScript Interface Online Free - Fast & Secure",
		description: "Convert JSON objects into clean TypeScript interfaces or type definitions automatically. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/json-to-typescript");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
