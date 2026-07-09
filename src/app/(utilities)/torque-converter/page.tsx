import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import UniversalUnitConverter from "@/components/tools/built-ins/UniversalUnitConverter";

export const metadata = {
	title: "Torque Converter Online Free - No Signup | SopKit",
	description: "Free torque converter tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/torque-converter/",
	},
	openGraph: {
		title: "Torque Converter Online Free - No Signup",
		description: "Free torque converter tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/torque-converter/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Torque Converter Online Free - Fast & Secure",
		description: "Free torque converter tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/torque-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<UniversalUnitConverter preset="torque" />
		</ToolLayout>
	);
}
