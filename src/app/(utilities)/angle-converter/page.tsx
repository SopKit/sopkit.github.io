import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import UniversalUnitConverter from "@/components/tools/built-ins/UniversalUnitConverter";

export const metadata = {
	title: "Angle Converter Online Free - No Signup | SopKit",
	description: "Convert between degrees, radians, gradians, and more instantly. Our free online Angle Converter is perfect for students, engineers, and mathematicians. Fast and accurate. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/angle-converter",
	},
	openGraph: {
		title: "Angle Converter Online Free - No Signup",
		description: "Convert between degrees, radians, gradians, and more instantly. Our free online Angle Converter is perfect for students, engineers, and mathematicians. Fast and",
		url: "https://sopkit.github.io/angle-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Angle Converter Online Free - Fast & Secure",
		description: "Convert between degrees, radians, gradians, and more instantly. Our free online Angle Converter is perfect for students, engineers, and mathematicians. Fast and",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/angle-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<UniversalUnitConverter preset="angle" />
		</ToolLayout>
	);
}
