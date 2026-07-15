import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free PDF Rotation Tool Online - No Signup | SopKit",
	description: "Manage, convert, edit, and secure PDF documents with our free PDF Rotation Tool online. Safe and private browser-based tool with no registration. Free & secure.",
	keywords: "pdf rotation tool, free online tool, no signup, pdf rotation tool online, pdf, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/pdf-rotation",
	},
	openGraph: {
		title: "Free PDF Rotation Tool Online - No Signup | SopKit",
		description: "Manage, convert, edit, and secure PDF documents with our free PDF Rotation Tool online. Safe and private browser-based tool with no registration. Free & secure.",
		url: "https://sopkit.github.io/pdf-rotation",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free PDF Rotation Tool Online - No Signup | SopKit",
		description: "Manage, convert, edit, and secure PDF documents with our free PDF Rotation Tool online. Safe and private browser-based tool with no registration. Free & secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/pdf-rotation");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
