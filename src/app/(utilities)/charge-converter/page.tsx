import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import UniversalUnitConverter from "@/components/tools/built-ins/UniversalUnitConverter";

export const metadata = {
	title: "Free Charge Converter Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Charge Converter online. Fast, secure browser-based utility with no registration. No registration needed.",
	keywords: "charge converter, free online tool, no signup, charge converter online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/charge-converter",
	},
	openGraph: {
		title: "Free Charge Converter Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Charge Converter online. Fast, secure browser-based utility with no registration. No registration needed.",
		url: "https://sopkit.github.io/charge-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Charge Converter Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Charge Converter online. Fast, secure browser-based utility with no registration. No registration needed.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/charge-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<UniversalUnitConverter preset="charge" />
		</ToolLayout>
	);
}
