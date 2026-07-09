import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import FaqSchemaGenerator from "@/components/tools/built-ins/FaqSchemaGenerator";

export const metadata = {
	title: "FAQ Schema Generator Online Free - No Signup | SopKit",
	description: "Free faq schema generator tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/faq-schema-generator/",
	},
	openGraph: {
		title: "FAQ Schema Generator Online Free - No Signup",
		description: "Free faq schema generator tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based t",
		url: "https://sopkit.github.io/faq-schema-generator/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "FAQ Schema Generator Online Free - Fast & Secure",
		description: "Free faq schema generator tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based t",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/faq-schema-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<FaqSchemaGenerator />
		</ToolLayout>
	);
}
