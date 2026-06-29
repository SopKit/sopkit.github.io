import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import LineSorterTool from "@/components/tools/text/LineSorterTool";

export const metadata = {
	title: "Line Sorter Online Free - No Signup | SopKit",
	description: "Sort lists, names, or lines alphabetically or by length instantly. Our free online Line Sorter helps you organize data for cleaner documentation and code. Privacy-friendly and fast. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/line-sorter/",
	},
	openGraph: {
		title: "Line Sorter Online Free - No Signup",
		description: "Sort lists, names, or lines alphabetically or by length instantly. Our free online Line Sorter helps you organize data for cleaner documentation and code. Priva",
		url: "https://sopkit.github.io/line-sorter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Line Sorter Online Free - Fast & Secure",
		description: "Sort lists, names, or lines alphabetically or by length instantly. Our free online Line Sorter helps you organize data for cleaner documentation and code. Priva",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/line-sorter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<LineSorterTool />
		</ToolLayout>
	);
}
