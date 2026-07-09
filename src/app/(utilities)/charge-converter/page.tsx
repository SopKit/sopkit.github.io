import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import UniversalUnitConverter from "@/components/tools/built-ins/UniversalUnitConverter";

export const metadata = {
	title: "Charge Converter Online Free - No Signup | SopKit",
	description: "Convert between coulombs, millicoulombs, and other electrical charge units instantly. Our free online tool provides quick and accurate physics base transformations. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/charge-converter/",
	},
	openGraph: {
		title: "Charge Converter Online Free - No Signup",
		description: "Convert between coulombs, millicoulombs, and other electrical charge units instantly. Our free online tool provides quick and accurate physics base transformati",
		url: "https://sopkit.github.io/charge-converter/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Charge Converter Online Free - Fast & Secure",
		description: "Convert between coulombs, millicoulombs, and other electrical charge units instantly. Our free online tool provides quick and accurate physics base transformati",
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
