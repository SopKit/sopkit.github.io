import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import UniversalUnitConverter from "@/components/tools/built-ins/UniversalUnitConverter";

export const metadata = {
	title: "Free Frequency Converter Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Frequency Converter online. Fast, secure browser-based utility with no registration. 100% free and secure.",
	keywords: "frequency converter, free online tool, no signup, frequency converter online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/frequency-converter",
	},
	openGraph: {
		title: "Free Frequency Converter Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Frequency Converter online. Fast, secure browser-based utility with no registration. 100% free and secure.",
		url: "https://sopkit.github.io/frequency-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Frequency Converter Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Frequency Converter online. Fast, secure browser-based utility with no registration. 100% free and secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/frequency-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<UniversalUnitConverter preset="frequency" />
		</ToolLayout>
	);
}
