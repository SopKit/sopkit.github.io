import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free HTML to XML Entities Converter Online - No Signup | SopKit",
	description: "Format, minify, validate, and convert code snippets with our free HTML to XML Entities Converter online. Secure, local developer utility with no registration.",
	keywords: "html to xml entities converter, free online tool, no signup, html to xml entities converter online, developer, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/html-to-xml-entities",
	},
	openGraph: {
		title: "Free HTML to XML Entities Converter Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free HTML to XML Entities Converter online. Secure, local developer utility with no registration.",
		url: "https://sopkit.github.io/html-to-xml-entities",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free HTML to XML Entities Converter Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free HTML to XML Entities Converter online. Secure, local developer utility with no registration.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/html-to-xml-entities");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
