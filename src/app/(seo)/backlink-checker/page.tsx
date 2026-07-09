import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSafeHttp from "@/components/tools/built-ins/BuiltInSafeHttp";

export const metadata = {
	title: "Backlink Checker Online Free - No Signup | SopKit",
	description: "Analyze backlinks for any website with our free backlink checker. Discover referring domains, anchor texts, and link quality metrics instantly. No signup required, unlimited checks, SEO-grade data. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/backlink-checker/",
	},
	openGraph: {
		title: "Backlink Checker Online Free - No Signup",
		description: "Analyze backlinks for any website with our free backlink checker. Discover referring domains, anchor texts, and link quality metrics instantly. No signup requir",
		url: "https://sopkit.github.io/backlink-checker/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Backlink Checker Online Free - Fast & Secure",
		description: "Analyze backlinks for any website with our free backlink checker. Discover referring domains, anchor texts, and link quality metrics instantly. No signup requir",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/backlink-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInSafeHttp toolId="backlink-checker" />
		</ToolLayout>
	);
}
