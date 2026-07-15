import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free CSS Border Radius Generator Online - No Signup | SopKit",
	description: "Format, minify, validate, and convert code snippets with our free CSS Border Radius Generator online. Secure, local developer utility with no registration.",
	keywords: "css border radius generator, free online tool, no signup, css border radius generator online, developer, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/css-border-radius-generator",
	},
	openGraph: {
		title: "Free CSS Border Radius Generator Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free CSS Border Radius Generator online. Secure, local developer utility with no registration.",
		url: "https://sopkit.github.io/css-border-radius-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free CSS Border Radius Generator Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free CSS Border Radius Generator online. Secure, local developer utility with no registration.",
		images: ["/og-image.jpg"],
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
