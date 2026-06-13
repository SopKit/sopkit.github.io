import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import UniversalUnitConverter from "@/components/tools/built-ins/UniversalUnitConverter";

export const metadata = {
	title: "Digital Converter Online Free - No Signup | SopKit",
	description: "Convert between bytes, kilobytes, megabytes, and gigabytes instantly. Our free online tool helps you understand data storage and file sizes in seconds. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/digital-converter",
	},
	openGraph: {
		title: "Digital Converter Online Free - No Signup",
		description: "Convert between bytes, kilobytes, megabytes, and gigabytes instantly. Our free online tool helps you understand data storage and file sizes in seconds. No signu",
		url: "https://sopkit.github.io/digital-converter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Digital Converter Online Free - Fast & Secure",
		description: "Convert between bytes, kilobytes, megabytes, and gigabytes instantly. Our free online tool helps you understand data storage and file sizes in seconds. No signu",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/digital-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<UniversalUnitConverter preset="digital" />
		</ToolLayout>
	);
}
