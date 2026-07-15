import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free Text to Binary/Hex/Octal Converter Online - No Signup | SopKit",
	description: "Format, clean, sort, and analyze text files instantly with our free Text to Binary/Hex/Octal Converter online. Fast and private browser utility with no signup.",
	keywords: "text to binary/hex/octal converter, free online tool, no signup, text to binary/hex/octal converter online, text, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/text-to-binary-hex-octal",
	},
	openGraph: {
		title: "Free Text to Binary/Hex/Octal Converter Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free Text to Binary/Hex/Octal Converter online. Fast and private browser utility with no signup.",
		url: "https://sopkit.github.io/text-to-binary-hex-octal",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Text to Binary/Hex/Octal Converter Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free Text to Binary/Hex/Octal Converter online. Fast and private browser utility with no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/text-to-binary-hex-octal");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
