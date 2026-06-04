import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import MetaTagGenerator from "@/components/tools/built-ins/MetaTagGenerator";

export const metadata = {
	title: "Meta Tag Generator Online Free - No Signup | SopKit",
	description: "Free meta tag generator tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/meta-tag-generator",
	},
	openGraph: {
		title: "Meta Tag Generator Online Free - No Signup",
		description: "Free meta tag generator tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based too",
		url: "https://sopkit.github.io/meta-tag-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Meta Tag Generator Online Free - Fast & Secure",
		description: "Free meta tag generator tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based too",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/meta-tag-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<MetaTagGenerator />
		</ToolLayout>
	);
}
