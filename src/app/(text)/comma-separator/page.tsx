import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import CommaSeparatorTool from "@/components/tools/text/CommaSeparatorTool";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Comma Separator Online - No Signup | SopKit",
	description: "Format, clean, sort, and analyze text files instantly with our free Comma Separator online. Fast and private browser utility with no signup. No signup required.",
	keywords: "comma separator, free online tool, no signup, comma-separator, free comma-separator, Comma Separator online, text tool, text editor online, content formatter, writing utility, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/comma-separator/",
	},
	openGraph: {
		title: "Free Comma Separator Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free Comma Separator online. Fast and private browser utility with no signup. No signup required.",
		url: "https://sopkit.github.io/comma-separator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Comma Separator Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free Comma Separator online. Fast and private browser utility with no signup. No signup required.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/comma-separator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<CommaSeparatorTool />
		</ToolLayout>
	);
}
