import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import RgbHexConverter from "@/components/tools/built-ins/RgbHexConverter";

export const metadata = {
	title: "Free Color Converter Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Color Converter online. Fast, secure browser-based utility with no registration. No registration needed.",
	keywords: "color converter, free online tool, no signup, color converter online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/color-converter",
	},
	openGraph: {
		title: "Free Color Converter Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Color Converter online. Fast, secure browser-based utility with no registration. No registration needed.",
		url: "https://sopkit.github.io/color-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Color Converter Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Color Converter online. Fast, secure browser-based utility with no registration. No registration needed.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/color-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<RgbHexConverter mode="color" />
		</ToolLayout>
	);
}
