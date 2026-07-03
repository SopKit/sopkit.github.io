import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free CSS Border Radius Generator Online | SopKit",
	description: "Generate CSS border-radius rules interactively. Adjust corner curves in pixels or percentages, preview changes live, and copy vendor-prefixed stylesheet rules.",
	alternates: {
		canonical: "https://sopkit.github.io/css-border-radius-generator/",
	},
	openGraph: {
		title: "Free CSS Border Radius Generator Online | SopKit",
		description: "Generate CSS border-radius rules interactively. Adjust corner curves in pixels or percentages, preview changes live, and copy vendor-prefixed stylesheet rules.",
		url: "https://sopkit.github.io/css-border-radius-generator/",
		siteName: "SopKit",
		images: [{ url: "/og-images/developer-tools.png" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free CSS Border Radius Generator Online | SopKit",
		description: "Generate CSS border-radius rules interactively. Adjust corner curves in pixels or percentages, preview changes live, and copy vendor-prefixed stylesheet rules.",
		images: ["/og-images/developer-tools.png"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/css-border-radius-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
