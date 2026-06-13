import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import RgbHexConverter from "@/components/tools/built-ins/RgbHexConverter";

export const metadata = {
	title: "Color Converter Online Free - No Signup | SopKit",
	description: "Transform color codes between HEX, RGB, HSL, and CMYK formats instantly. Our free online tool helps designers and developers manage color schemes with precision. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/color-converter",
	},
	openGraph: {
		title: "Color Converter Online Free - No Signup",
		description: "Transform color codes between HEX, RGB, HSL, and CMYK formats instantly. Our free online tool helps designers and developers manage color schemes with precision",
		url: "https://sopkit.github.io/color-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Color Converter Online Free - Fast & Secure",
		description: "Transform color codes between HEX, RGB, HSL, and CMYK formats instantly. Our free online tool helps designers and developers manage color schemes with precision",
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
