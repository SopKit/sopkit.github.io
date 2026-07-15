import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free PDF Merger Online - No Signup | SopKit",
	description: "Manage, convert, edit, and secure PDF documents with our free PDF Merger online. Safe and private browser-based tool with no registration. 100% free and secure.",
	keywords: "pdf merger, free online tool, no signup, pdf merger online, pdf, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/pdf-merger",
	},
	openGraph: {
		title: "Free PDF Merger Online - No Signup | SopKit",
		description: "Manage, convert, edit, and secure PDF documents with our free PDF Merger online. Safe and private browser-based tool with no registration. 100% free and secure.",
		url: "https://sopkit.github.io/pdf-merger",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free PDF Merger Online - No Signup | SopKit",
		description: "Manage, convert, edit, and secure PDF documents with our free PDF Merger online. Safe and private browser-based tool with no registration. 100% free and secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/pdf-merger");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
