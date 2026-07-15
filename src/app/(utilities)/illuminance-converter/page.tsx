import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import UniversalUnitConverter from "@/components/tools/built-ins/UniversalUnitConverter";

export const metadata = {
	title: "Free Illuminance Converter Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Illuminance Converter online. Fast, secure browser-based utility with no registration. No signup required.",
	keywords: "illuminance converter, free online tool, no signup, illuminance converter online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/illuminance-converter",
	},
	openGraph: {
		title: "Free Illuminance Converter Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Illuminance Converter online. Fast, secure browser-based utility with no registration. No signup required.",
		url: "https://sopkit.github.io/illuminance-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Illuminance Converter Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Illuminance Converter online. Fast, secure browser-based utility with no registration. No signup required.",
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
