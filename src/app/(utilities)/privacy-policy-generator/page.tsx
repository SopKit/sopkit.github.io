import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import LegalTemplateGenerator from "@/components/tools/built-ins/LegalTemplateGenerator";

export const metadata = {
	title: "Privacy Policy Generator Online Free - No Signup | SopKit",
	description: "Free privacy policy generator tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/privacy-policy-generator/",
	},
	openGraph: {
		title: "Privacy Policy Generator Online Free - No Signup",
		description: "Free privacy policy generator tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-bas",
		url: "https://sopkit.github.io/privacy-policy-generator/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Privacy Policy Generator Online Free - Fast & Secure",
		description: "Free privacy policy generator tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-bas",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/privacy-policy-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<LegalTemplateGenerator />
		</ToolLayout>
	);
}
