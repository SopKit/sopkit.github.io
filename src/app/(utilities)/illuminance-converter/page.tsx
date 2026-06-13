import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import UniversalUnitConverter from "@/components/tools/built-ins/UniversalUnitConverter";

export const metadata = {
	title: "Illuminance Converter Online Free - No Signup | SopKit",
	description: "Free illuminance converter tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/illuminance-converter",
	},
	openGraph: {
		title: "Illuminance Converter Online Free - No Signup",
		description: "Free illuminance converter tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based ",
		url: "https://sopkit.github.io/illuminance-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Illuminance Converter Online Free - Fast & Secure",
		description: "Free illuminance converter tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based ",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/illuminance-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<UniversalUnitConverter preset="illuminance" />
		</ToolLayout>
	);
}
