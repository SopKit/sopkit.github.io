import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BaseConverter from "@/components/tools/shared/BaseConverter";

export const metadata = {
	title: "HEX to Binary Converter Online Free - Developer Tools | SopKit",
	description: "Transform hexadecimal values into binary code instantly. Our free online HEX to Binary converter is perfect for developers, hardware engineers, and technical students. Fast and secure. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/hex-to-binary-converter/",
	},
	openGraph: {
		title: "HEX to Binary Converter Online Free - No Signup",
		description: "Transform hexadecimal values into binary code instantly. Our free online HEX to Binary converter is perfect for developers, hardware engineers, and technical st",
		url: "https://sopkit.github.io/hex-to-binary-converter/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "HEX to Binary Converter Online Free - Fast & Secure",
		description: "Transform hexadecimal values into binary code instantly. Our free online HEX to Binary converter is perfect for developers, hardware engineers, and technical st",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/hex-to-binary-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BaseConverter converterKind="hex-to-binary" />
		</ToolLayout>
	);
}
