import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import UniversalUnitConverter from "@/components/tools/built-ins/UniversalUnitConverter";

export const metadata = {
	title: "Free Parts Per Converter Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Parts Per Converter online. Fast, secure browser-based utility with no registration. 100% free and secure.",
	keywords: "parts per converter, free online tool, no signup, parts per converter online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/parts-per-converter",
	},
	openGraph: {
		title: "Free Parts Per Converter Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Parts Per Converter online. Fast, secure browser-based utility with no registration. 100% free and secure.",
		url: "https://sopkit.github.io/parts-per-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Parts Per Converter Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Parts Per Converter online. Fast, secure browser-based utility with no registration. 100% free and secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/parts-per-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<UniversalUnitConverter preset="dimensionless" />
		</ToolLayout>
	);
}
