import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Free Number to Words Converter Online - No Signup | SopKit",
	description: "Compute rates, taxes, averages, and conversions with our free Number to Words Converter online. Quick, accurate browser calculator with no registration.",
	keywords: "number to words converter, free online tool, no signup, number to words converter online, calculators, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/number-to-words-converter",
	},
	openGraph: {
		title: "Free Number to Words Converter Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Number to Words Converter online. Quick, accurate browser calculator with no registration.",
		url: "https://sopkit.github.io/number-to-words-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Number to Words Converter Online - No Signup | SopKit",
		description: "Compute rates, taxes, averages, and conversions with our free Number to Words Converter online. Quick, accurate browser calculator with no registration.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/number-to-words-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
