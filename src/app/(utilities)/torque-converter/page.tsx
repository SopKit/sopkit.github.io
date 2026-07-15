import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import UniversalUnitConverter from "@/components/tools/built-ins/UniversalUnitConverter";

export const metadata = {
	title: "Free Torque Converter Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Torque Converter online. Fast, secure browser-based utility with no registration. No registration needed.",
	keywords: "torque converter, free online tool, no signup, torque converter online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/torque-converter",
	},
	openGraph: {
		title: "Free Torque Converter Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Torque Converter online. Fast, secure browser-based utility with no registration. No registration needed.",
		url: "https://sopkit.github.io/torque-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Torque Converter Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Torque Converter online. Fast, secure browser-based utility with no registration. No registration needed.",
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
