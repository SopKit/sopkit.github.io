import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Free JSON to TypeScript Interface Online - No Signup | SopKit",
	description: "Format, minify, validate, and convert code snippets with our free JSON to TypeScript Interface online. Secure, local developer utility with no registration.",
	keywords: "json to typescript interface, free online tool, no signup, json to typescript interface online, developer, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/json-to-typescript",
	},
	openGraph: {
		title: "Free JSON to TypeScript Interface Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free JSON to TypeScript Interface online. Secure, local developer utility with no registration.",
		url: "https://sopkit.github.io/json-to-typescript",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free JSON to TypeScript Interface Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free JSON to TypeScript Interface online. Secure, local developer utility with no registration.",
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
