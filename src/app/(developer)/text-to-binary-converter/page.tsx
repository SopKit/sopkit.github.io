import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BaseConverter from "@/components/tools/shared/BaseConverter";

export const metadata = {
	title: "Text to Binary Converter Online Free - Developer Tools | SopKit",
	description: "Translate text into binary code (0s and 1s) instantly. Our free online converter is perfect for learning how computers represent data and creating secret binary messages. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/text-to-binary-converter/",
	},
	openGraph: {
		title: "Text to Binary Converter Online Free - No Signup",
		description: "Translate text into binary code (0s and 1s) instantly. Our free online converter is perfect for learning how computers represent data and creating secret binary",
		url: "https://sopkit.github.io/text-to-binary-converter/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Text to Binary Converter Online Free - Fast & Secure",
		description: "Translate text into binary code (0s and 1s) instantly. Our free online converter is perfect for learning how computers represent data and creating secret binary",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/text-to-binary-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BaseConverter converterKind="text-to-binary" />
		</ToolLayout>
	);
}
