import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Free Roman Numerals Converter Online - No Signup | SopKit",
	description: "Compute rates, taxes, averages, and conversions with our free Roman Numerals Converter online. Quick, accurate browser calculator with no registration.",
	keywords: "roman numerals converter, free online tool, no signup, roman numerals converter online, calculators, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/roman-numerals-converter",
	},
	openGraph: {
		title: "Free Roman Numerals Converter Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Roman Numerals Converter online. Quick, accurate browser calculator with no registration.",
		url: "https://sopkit.github.io/roman-numerals-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Roman Numerals Converter Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Roman Numerals Converter online. Quick, accurate browser calculator with no registration.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/roman-numerals-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
