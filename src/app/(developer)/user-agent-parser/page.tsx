import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free User Agent Parser Online - Detect OS & Browser | SopKit",
	description: "Parse and analyze any User Agent string instantly. Detect the browser family, version, operating system, layout rendering engine, and platform details. Free and secure.",
	alternates: {
		canonical: "https://sopkit.github.io/user-agent-parser/",
	},
	openGraph: {
		title: "Free User Agent Parser Online - Detect OS & Browser | SopKit",
		description: "Parse and analyze any User Agent string instantly. Detect the browser family, version, operating system, layout rendering engine, and platform details. Free and secure.",
		url: "https://sopkit.github.io/user-agent-parser/",
		siteName: "SopKit",
		images: [{ url: "/og-images/developer-tools.png" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free User Agent Parser Online - Detect OS & Browser | SopKit",
		description: "Parse and analyze any User Agent string instantly. Detect the browser family, version, operating system, layout rendering engine, and platform details. Free and secure.",
		images: ["/og-images/developer-tools.png"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/user-agent-parser");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
