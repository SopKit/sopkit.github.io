import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import UniversalUnitConverter from "@/components/tools/built-ins/UniversalUnitConverter";

export const metadata = {
	title: "Apparent Power Converter Online Free - No Signup | SopKit",
	description: "Convert between volt-amperes (VA), millivolt-amperes, and more instantly. Our free online tool is perfect for electrical engineers and technicians. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/apparent-power-converter",
	},
	openGraph: {
		title: "Apparent Power Converter Online Free - No Signup",
		description: "Convert between volt-amperes (VA), millivolt-amperes, and more instantly. Our free online tool is perfect for electrical engineers and technicians. No signup, n",
		url: "https://sopkit.github.io/apparent-power-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Apparent Power Converter Online Free - Fast & Secure",
		description: "Convert between volt-amperes (VA), millivolt-amperes, and more instantly. Our free online tool is perfect for electrical engineers and technicians. No signup, n",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/apparent-power-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<UniversalUnitConverter preset="apparentPower" />
		</ToolLayout>
	);
}
