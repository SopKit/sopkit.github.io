import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free PDF Watermark Creator Online - No Signup | SopKit",
	description: "Manage, convert, edit, and secure PDF documents with our free PDF Watermark Creator online. Safe and private browser-based tool with no registration. 100% free.",
	keywords: "pdf watermark creator, free online tool, no signup, pdf watermark creator online, pdf, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/pdf-watermark",
	},
	openGraph: {
		title: "Free PDF Watermark Creator Online - No Signup | SopKit",
		description: "Manage, convert, edit, and secure PDF documents with our free PDF Watermark Creator online. Safe and private browser-based tool with no registration. 100% free.",
		url: "https://sopkit.github.io/pdf-watermark",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free PDF Watermark Creator Online - No Signup | SopKit",
		description: "Manage, convert, edit, and secure PDF documents with our free PDF Watermark Creator online. Safe and private browser-based tool with no registration. 100% free.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/pdf-watermark");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
