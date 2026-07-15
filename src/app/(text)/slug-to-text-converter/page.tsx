import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free Slug to Text Converter Online - No Signup | SopKit",
	description: "Format, clean, sort, and analyze text files instantly with our free Slug to Text Converter online. Fast and private browser utility with no signup. Easy to use.",
	keywords: "slug to text converter, free online tool, no signup, slug to text converter online, text, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/slug-to-text-converter",
	},
	openGraph: {
		title: "Free Slug to Text Converter Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free Slug to Text Converter online. Fast and private browser utility with no signup. Easy to use.",
		url: "https://sopkit.github.io/slug-to-text-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Slug to Text Converter Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free Slug to Text Converter online. Fast and private browser utility with no signup. Easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/slug-to-text-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
