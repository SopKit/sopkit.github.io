import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import RomanNumeralTool from "@/components/tools/built-ins/RomanNumeralTool";

export const metadata = {
	title: "Roman Numerals to Number Online Free - No Signup | SopKit",
	description: "Free roman numerals to number tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/roman-numerals-to-number",
	},
	openGraph: {
		title: "Roman Numerals to Number Online Free - No Signup",
		description: "Free roman numerals to number tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-bas",
		url: "https://sopkit.github.io/roman-numerals-to-number",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Roman Numerals to Number Online Free - Fast & Secure",
		description: "Free roman numerals to number tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-bas",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/roman-numerals-to-number");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<RomanNumeralTool />
		</ToolLayout>
	);
}
