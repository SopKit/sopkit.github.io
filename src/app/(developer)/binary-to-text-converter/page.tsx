import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BaseConverter from "@/components/tools/shared/BaseConverter";

export const metadata = {
	title: "Binary to Text Converter Online Free - Developer Tools | SopKit",
	description: "Decode binary strings into readable text instantly. Our free online tool is perfect for discovering hidden messages or debugging data streams. 100% free and secure. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/binary-to-text-converter/",
	},
	openGraph: {
		title: "Binary to Text Converter Online Free - No Signup",
		description: "Decode binary strings into readable text instantly. Our free online tool is perfect for discovering hidden messages or debugging data streams. 100% free and sec",
		url: "https://sopkit.github.io/binary-to-text-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Binary to Text Converter Online Free - Fast & Secure",
		description: "Decode binary strings into readable text instantly. Our free online tool is perfect for discovering hidden messages or debugging data streams. 100% free and sec",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/binary-to-text-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BaseConverter converterKind="binary-to-text" />
		</ToolLayout>
	);
}
