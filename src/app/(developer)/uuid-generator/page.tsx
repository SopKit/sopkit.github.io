import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "UUID/GUID Generator Online Free | SopKit",
	description: "Generate unique UUID v4 and GUID strings instantly for your applications and databases. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/uuid-generator/",
	},
	openGraph: {
		title: "UUID/GUID Generator Online Free - No Signup | SopKit",
		description: "Generate unique UUID v4 and GUID strings instantly for your applications and databases. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/uuid-generator/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "UUID/GUID Generator Online Free - Fast & Secure",
		description: "Generate unique UUID v4 and GUID strings instantly for your applications and databases. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/uuid-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
