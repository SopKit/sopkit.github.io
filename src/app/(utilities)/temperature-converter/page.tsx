import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import UniversalUnitConverter from "@/components/tools/built-ins/UniversalUnitConverter";

export const metadata = {
	title: "Free Temperature Converter Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Temperature Converter online. Fast, secure browser-based utility with no registration. No signup required.",
	keywords: "temperature converter, free online tool, no signup, temperature converter online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/temperature-converter",
	},
	openGraph: {
		title: "Free Temperature Converter Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Temperature Converter online. Fast, secure browser-based utility with no registration. No signup required.",
		url: "https://sopkit.github.io/temperature-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Temperature Converter Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Temperature Converter online. Fast, secure browser-based utility with no registration. No signup required.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/temperature-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<UniversalUnitConverter preset="temperature" />
		</ToolLayout>
	);
}
