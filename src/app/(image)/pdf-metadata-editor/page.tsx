import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free PDF Metadata Editor Online - No Signup | SopKit",
	description: "Manage, convert, edit, and secure PDF documents with our free PDF Metadata Editor online. Safe and private browser-based tool with no registration. Easy to use.",
	keywords: "pdf metadata editor, free online tool, no signup, pdf metadata editor online, pdf, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/pdf-metadata-editor",
	},
	openGraph: {
		title: "Free PDF Metadata Editor Online - No Signup | SopKit",
		description: "Manage, convert, edit, and secure PDF documents with our free PDF Metadata Editor online. Safe and private browser-based tool with no registration. Easy to use.",
		url: "https://sopkit.github.io/pdf-metadata-editor",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free PDF Metadata Editor Online - No Signup | SopKit",
		description: "Manage, convert, edit, and secure PDF documents with our free PDF Metadata Editor online. Safe and private browser-based tool with no registration. Easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/pdf-metadata-editor");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
