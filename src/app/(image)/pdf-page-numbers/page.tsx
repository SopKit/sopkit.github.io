import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free PDF Page Numbers Adder Online - No Signup | SopKit",
	description: "Manage, convert, edit, and secure PDF documents with our free PDF Page Numbers Adder online. Safe and private browser-based tool with no registration.",
	keywords: "pdf page numbers adder, free online tool, no signup, pdf page numbers adder online, pdf, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/pdf-page-numbers",
	},
	openGraph: {
		title: "Free PDF Page Numbers Adder Online - No Signup | SopKit",
		description: "Manage, convert, edit, and secure PDF documents with our free PDF Page Numbers Adder online. Safe and private browser-based tool with no registration.",
		url: "https://sopkit.github.io/pdf-page-numbers",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free PDF Page Numbers Adder Online - No Signup | SopKit",
		description: "Manage, convert, edit, and secure PDF documents with our free PDF Page Numbers Adder online. Safe and private browser-based tool with no registration.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/pdf-page-numbers");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
