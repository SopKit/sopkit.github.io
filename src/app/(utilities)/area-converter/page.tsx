import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import UniversalUnitConverter from "@/components/tools/built-ins/UniversalUnitConverter";

export const metadata = {
	title: "Area Converter Online Free - No Signup | SopKit",
	description: "Convert between square meters, square feet, acres, and more instantly. Our free online Area Converter is perfect for real estate, construction, and design projects. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/area-converter/",
	},
	openGraph: {
		title: "Area Converter Online Free - No Signup",
		description: "Convert between square meters, square feet, acres, and more instantly. Our free online Area Converter is perfect for real estate, construction, and design proje",
		url: "https://sopkit.github.io/area-converter/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Area Converter Online Free - Fast & Secure",
		description: "Convert between square meters, square feet, acres, and more instantly. Our free online Area Converter is perfect for real estate, construction, and design proje",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/area-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<UniversalUnitConverter preset="area" />
		</ToolLayout>
	);
}
