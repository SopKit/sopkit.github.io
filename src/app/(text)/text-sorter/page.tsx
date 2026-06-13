import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import LineSorterTool from "@/components/tools/text/LineSorterTool";

export const metadata = {
	title: "Text Sorter Online Free - No Signup | SopKit",
	description: "Organize your lists and text lines with our free online Text Sorter. Sort alphabetically, by length, or reverse order instantly. Privacy-focused tool for researchers and developers. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/text-sorter",
	},
	openGraph: {
		title: "Text Sorter Online Free - No Signup",
		description: "Organize your lists and text lines with our free online Text Sorter. Sort alphabetically, by length, or reverse order instantly. Privacy-focused tool for resear",
		url: "https://sopkit.github.io/text-sorter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Text Sorter Online Free - Fast & Secure",
		description: "Organize your lists and text lines with our free online Text Sorter. Sort alphabetically, by length, or reverse order instantly. Privacy-focused tool for resear",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/text-sorter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<LineSorterTool />
		</ToolLayout>
	);
}
