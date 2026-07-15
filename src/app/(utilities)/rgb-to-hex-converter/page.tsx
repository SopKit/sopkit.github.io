import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import RgbHexConverter from "@/components/tools/built-ins/RgbHexConverter";

export const metadata = {
	title: "Free RGB to HEX Converter Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free RGB to HEX Converter online. Fast, secure browser-based utility with no registration. No signup required.",
	keywords: "rgb to hex converter, free online tool, no signup, rgb to hex converter online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/rgb-to-hex-converter",
	},
	openGraph: {
		title: "Free RGB to HEX Converter Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free RGB to HEX Converter online. Fast, secure browser-based utility with no registration. No signup required.",
		url: "https://sopkit.github.io/rgb-to-hex-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free RGB to HEX Converter Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free RGB to HEX Converter online. Fast, secure browser-based utility with no registration. No signup required.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/rgb-to-hex-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<RgbHexConverter mode="rgb-hex" />
		</ToolLayout>
	);
}
