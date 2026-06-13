import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import HashGeneratorTool from "@/components/tools/security/HashGeneratorTool";

export const metadata = {
	title: "MD5 Generator Online Free - No Signup | SopKit",
	description: "Free md5 generator tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/md5-generator",
	},
	openGraph: {
		title: "MD5 Generator Online Free - No Signup",
		description: "Free md5 generator tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/md5-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "MD5 Generator Online Free - Fast & Secure",
		description: "Free md5 generator tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/md5-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<HashGeneratorTool />
		</ToolLayout>
	);
}
