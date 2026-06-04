import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import ImageConverterTool from "@/components/tools/image/ImageConverterTool";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Convert to ICO Online - No Signup | SopKit",
	description: "Free convert to ico tool to process your data instantly with privacy-friendly browser-based workflows.",
	keywords: "convert to ico, free online tool, no signup, convert-to-ico, free convert-to-ico, Convert To Ico online, image editing, photo editor, browser image tool, free photo utility, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/convert-to-ico",
	},
	openGraph: {
		title: "Free Convert to ICO Online - No Signup | SopKit",
		description: "Free convert to ico tool to process your data instantly with privacy-friendly browser-based workflows.",
		url: "https://sopkit.github.io/convert-to-ico",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Convert to ICO Online - No Signup | SopKit",
		description: "Free convert to ico tool to process your data instantly with privacy-friendly browser-based workflows.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/convert-to-ico");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<ImageConverterTool />
		</ToolLayout>
	);
}
