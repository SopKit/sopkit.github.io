import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import UniversalUnitConverter from "@/components/tools/built-ins/UniversalUnitConverter";

export const metadata = {
	title: "Current Converter Online Free - No Signup | SopKit",
	description: "Convert between amperes, milliamperes, and other electrical current units instantly. Our free online tool is perfect for electronics and electrical engineering tasks. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/current-converter",
	},
	openGraph: {
		title: "Current Converter Online Free - No Signup",
		description: "Convert between amperes, milliamperes, and other electrical current units instantly. Our free online tool is perfect for electronics and electrical engineering ",
		url: "https://sopkit.github.io/current-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Current Converter Online Free - Fast & Secure",
		description: "Convert between amperes, milliamperes, and other electrical current units instantly. Our free online tool is perfect for electronics and electrical engineering ",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/current-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<UniversalUnitConverter preset="current" />
		</ToolLayout>
	);
}
