import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import UniversalUnitConverter from "@/components/tools/built-ins/UniversalUnitConverter";

export const metadata = {
	title: "Free Reactive Power Converter Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Reactive Power Converter online. Fast, secure browser-based utility with no registration. Try it free now.",
	keywords: "reactive power converter, free online tool, no signup, reactive power converter online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/reactive-power-converter",
	},
	openGraph: {
		title: "Free Reactive Power Converter Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Reactive Power Converter online. Fast, secure browser-based utility with no registration. Try it free now.",
		url: "https://sopkit.github.io/reactive-power-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Reactive Power Converter Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Reactive Power Converter online. Fast, secure browser-based utility with no registration. Try it free now.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/reactive-power-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<UniversalUnitConverter preset="reactivePower" />
		</ToolLayout>
	);
}
