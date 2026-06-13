import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import LogoGeneratorTool from "@/components/tools/image/LogoGeneratorTool";

export const metadata = {
	title: "Logo Generator Online Free - Compress & Convert Images | SopKit",
	description: "Create professional logos with text, fonts, and custom colors No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/logo-generator",
	},
	openGraph: {
		title: "Logo Generator Online Free - No Signup",
		description: "Create professional logos with text, fonts, and custom colors No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/logo-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Logo Generator Online Free - Fast & Secure",
		description: "Create professional logos with text, fonts, and custom colors No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/logo-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<LogoGeneratorTool />
		</ToolLayout>
	);
}
