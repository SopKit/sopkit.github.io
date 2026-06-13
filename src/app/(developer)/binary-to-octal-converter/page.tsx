import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BaseConverter from "@/components/tools/shared/BaseConverter";

export const metadata = {
	title: "Binary to Octal Converter Online Free - Developer Tools | SopKit",
	description: "Convert binary numbers to octal format instantly. Our free online converter provides quick and accurate base transformations for developers and technical students. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/binary-to-octal-converter",
	},
	openGraph: {
		title: "Binary to Octal Converter Online Free - No Signup",
		description: "Convert binary numbers to octal format instantly. Our free online converter provides quick and accurate base transformations for developers and technical studen",
		url: "https://sopkit.github.io/binary-to-octal-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Binary to Octal Converter Online Free - Fast & Secure",
		description: "Convert binary numbers to octal format instantly. Our free online converter provides quick and accurate base transformations for developers and technical studen",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/binary-to-octal-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BaseConverter converterKind="binary-to-octal" />
		</ToolLayout>
	);
}
