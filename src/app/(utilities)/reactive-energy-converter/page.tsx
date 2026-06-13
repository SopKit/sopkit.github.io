import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import UniversalUnitConverter from "@/components/tools/built-ins/UniversalUnitConverter";

export const metadata = {
	title: "Reactive Energy Converter Online Free - No Signup | SopKit",
	description: "Free reactive energy converter tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/reactive-energy-converter",
	},
	openGraph: {
		title: "Reactive Energy Converter Online Free - No Signup",
		description: "Free reactive energy converter tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-ba",
		url: "https://sopkit.github.io/reactive-energy-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Reactive Energy Converter Online Free - Fast & Secure",
		description: "Free reactive energy converter tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-ba",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/reactive-energy-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<UniversalUnitConverter preset="energy" />
		</ToolLayout>
	);
}
