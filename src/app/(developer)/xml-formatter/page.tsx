import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Free XML Formatter & Beautifier Online - No Signup | SopKit",
	description: "Format, minify, validate, and convert code snippets with our free XML Formatter & Beautifier online. Secure, local developer utility with no registration.",
	keywords: "xml formatter & beautifier, free online tool, no signup, xml formatter & beautifier online, developer, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/xml-formatter",
	},
	openGraph: {
		title: "Free XML Formatter & Beautifier Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free XML Formatter & Beautifier online. Secure, local developer utility with no registration.",
		url: "https://sopkit.github.io/xml-formatter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free XML Formatter & Beautifier Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free XML Formatter & Beautifier online. Secure, local developer utility with no registration.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/xml-formatter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
