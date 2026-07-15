import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free PDF Splitter Online - No Signup | SopKit",
	description: "Manage, convert, edit, and secure PDF documents with our free PDF Splitter online. Safe and private browser-based tool with no registration. No signup required.",
	keywords: "pdf splitter, free online tool, no signup, pdf splitter online, pdf, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/pdf-splitter",
	},
	openGraph: {
		title: "Free PDF Splitter Online - No Signup | SopKit",
		description: "Manage, convert, edit, and secure PDF documents with our free PDF Splitter online. Safe and private browser-based tool with no registration. No signup required.",
		url: "https://sopkit.github.io/pdf-splitter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free PDF Splitter Online - No Signup | SopKit",
		description: "Manage, convert, edit, and secure PDF documents with our free PDF Splitter online. Safe and private browser-based tool with no registration. No signup required.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/pdf-splitter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
