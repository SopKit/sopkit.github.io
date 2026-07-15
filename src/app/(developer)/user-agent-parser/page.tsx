import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free User Agent Parser Online - No Signup | SopKit",
	description: "Format, minify, validate, and convert code snippets with our free User Agent Parser online. Secure, local developer utility with no registration. Free & secure.",
	keywords: "user agent parser, free online tool, no signup, user agent parser online, developer, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/user-agent-parser",
	},
	openGraph: {
		title: "Free User Agent Parser Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free User Agent Parser online. Secure, local developer utility with no registration. Free & secure.",
		url: "https://sopkit.github.io/user-agent-parser",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free User Agent Parser Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free User Agent Parser online. Secure, local developer utility with no registration. Free & secure.",
		images: ["/og-image.jpg"],
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
