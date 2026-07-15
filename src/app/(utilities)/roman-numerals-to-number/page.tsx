import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import RomanNumeralTool from "@/components/tools/built-ins/RomanNumeralTool";

export const metadata = {
	title: "Free Roman Numerals to Number Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Roman Numerals to Number online. Fast, secure browser-based utility with no registration. Try it free now.",
	keywords: "roman numerals to number, free online tool, no signup, roman numerals to number online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/roman-numerals-to-number",
	},
	openGraph: {
		title: "Free Roman Numerals to Number Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Roman Numerals to Number online. Fast, secure browser-based utility with no registration. Try it free now.",
		url: "https://sopkit.github.io/roman-numerals-to-number",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Roman Numerals to Number Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Roman Numerals to Number online. Fast, secure browser-based utility with no registration. Try it free now.",
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
