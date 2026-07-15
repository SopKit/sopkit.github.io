import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import RgbHexConverter from "@/components/tools/built-ins/RgbHexConverter";

export const metadata = {
	title: "Free HEX to RGB Converter Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free HEX to RGB Converter online. Fast, secure browser-based utility with no registration. No signup required.",
	keywords: "hex to rgb converter, free online tool, no signup, hex to rgb converter online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/hex-to-rgb-converter",
	},
	openGraph: {
		title: "Free HEX to RGB Converter Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free HEX to RGB Converter online. Fast, secure browser-based utility with no registration. No signup required.",
		url: "https://sopkit.github.io/hex-to-rgb-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free HEX to RGB Converter Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free HEX to RGB Converter online. Fast, secure browser-based utility with no registration. No signup required.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/hex-to-rgb-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<RgbHexConverter mode="hex-rgb" />
		</ToolLayout>
	);
}
