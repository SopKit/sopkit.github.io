import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import UniversalUnitConverter from "@/components/tools/built-ins/UniversalUnitConverter";

export const metadata = {
	title: "Volumetric Flow Rate Converter Online Free - No Signup | SopKit",
	description: "Free volumetric flow rate converter tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/volumetric-flow-rate-converter/",
	},
	openGraph: {
		title: "Volumetric Flow Rate Converter Online Free - No Signup",
		description: "Free volumetric flow rate converter tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private brows",
		url: "https://sopkit.github.io/volumetric-flow-rate-converter/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Volumetric Flow Rate Converter Online Free - Fast & Secure",
		description: "Free volumetric flow rate converter tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private brows",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/volumetric-flow-rate-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<UniversalUnitConverter preset="flowVolume" />
		</ToolLayout>
	);
}
