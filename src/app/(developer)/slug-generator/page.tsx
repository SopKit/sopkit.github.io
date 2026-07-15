import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Free URL Slug Generator Online - No Signup | SopKit",
	description: "Format, minify, validate, and convert code snippets with our free URL Slug Generator online. Secure, local developer utility with no registration. Easy to use.",
	keywords: "url slug generator, free online tool, no signup, url slug generator online, developer, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/slug-generator",
	},
	openGraph: {
		title: "Free URL Slug Generator Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free URL Slug Generator online. Secure, local developer utility with no registration. Easy to use.",
		url: "https://sopkit.github.io/slug-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free URL Slug Generator Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free URL Slug Generator online. Secure, local developer utility with no registration. Easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/slug-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
