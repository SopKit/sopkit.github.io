import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import LineSorterTool from "@/components/tools/text/LineSorterTool";

export const metadata = {
	title: "Free Text Sorter Online - No Signup | SopKit",
	description: "Format, clean, sort, and analyze text files instantly with our free Text Sorter online. Fast and private browser utility with no signup. No registration needed.",
	keywords: "text sorter, free online tool, no signup, text sorter online, text, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/text-sorter",
	},
	openGraph: {
		title: "Free Text Sorter Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free Text Sorter online. Fast and private browser utility with no signup. No registration needed.",
		url: "https://sopkit.github.io/text-sorter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Text Sorter Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free Text Sorter online. Fast and private browser utility with no signup. No registration needed.",
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
