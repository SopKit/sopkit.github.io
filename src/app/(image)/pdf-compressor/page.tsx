import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free PDF Compressor Online - No Signup | SopKit",
	description: "Manage, convert, edit, and secure PDF documents with our free PDF Compressor online. Safe and private browser-based tool with no registration. Try it free now.",
	keywords: "pdf compressor, free online tool, no signup, pdf compressor online, pdf, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/pdf-compressor",
	},
	openGraph: {
		title: "Free PDF Compressor Online - No Signup | SopKit",
		description: "Manage, convert, edit, and secure PDF documents with our free PDF Compressor online. Safe and private browser-based tool with no registration. Try it free now.",
		url: "https://sopkit.github.io/pdf-compressor",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free PDF Compressor Online - No Signup | SopKit",
		description: "Manage, convert, edit, and secure PDF documents with our free PDF Compressor online. Safe and private browser-based tool with no registration. Try it free now.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/pdf-compressor");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
