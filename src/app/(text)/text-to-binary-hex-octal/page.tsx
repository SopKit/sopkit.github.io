import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Text to Binary Hex Octal Converter Online | SopKit",
	description: "Convert string text to binary, hexadecimal, and octal representations simultaneously. Lightweight, secure, and runs entirely in your browser. 100% free.",
	alternates: {
		canonical: "https://sopkit.github.io/text-to-binary-hex-octal/",
	},
	openGraph: {
		title: "Text to Binary Hex Octal Converter Online | SopKit",
		description: "Convert string text to binary, hexadecimal, and octal representations simultaneously. Lightweight, secure, and runs entirely in your browser. 100% free.",
		url: "https://sopkit.github.io/text-to-binary-hex-octal/",
		siteName: "SopKit",
		images: [{ url: "/og-images/text-tools.png" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Text to Binary Hex Octal Converter Online | SopKit",
		description: "Convert string text to binary, hexadecimal, and octal representations simultaneously. Lightweight, secure, and runs entirely in your browser. 100% free.",
		images: ["/og-images/text-tools.png"],
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
