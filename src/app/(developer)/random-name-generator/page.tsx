import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Free Random Name Generator Online - No Signup | SopKit",
	description: "Format, minify, validate, and convert code snippets with our free Random Name Generator online. Secure, local developer utility with no registration. 100% free.",
	keywords: "random name generator, free online tool, no signup, random name generator online, developer, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/random-name-generator",
	},
	openGraph: {
		title: "Free Random Name Generator Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free Random Name Generator online. Secure, local developer utility with no registration. 100% free.",
		url: "https://sopkit.github.io/random-name-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Random Name Generator Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free Random Name Generator online. Secure, local developer utility with no registration. 100% free.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/random-name-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
