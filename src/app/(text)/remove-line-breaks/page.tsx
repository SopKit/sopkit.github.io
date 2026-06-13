import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import RemoveLineBreaksTool from "@/components/tools/text/RemoveLineBreaksTool";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Remove Line Breaks Online - No Signup | SopKit",
	description: "Format, clean, sort, and analyze text files instantly with our free Remove Line Breaks online. Fast and private browser utility with no signup. Try it free now.",
	keywords: "remove line breaks, free online tool, no signup, remove-line-breaks, free remove-line-breaks, Remove Line Breaks online, text tool, text editor online, content formatter, writing utility, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/remove-line-breaks",
	},
	openGraph: {
		title: "Free Remove Line Breaks Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free Remove Line Breaks online. Fast and private browser utility with no signup. Try it free now.",
		url: "https://sopkit.github.io/remove-line-breaks",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Remove Line Breaks Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free Remove Line Breaks online. Fast and private browser utility with no signup. Try it free now.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/remove-line-breaks");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<RemoveLineBreaksTool />
		</ToolLayout>
	);
}
