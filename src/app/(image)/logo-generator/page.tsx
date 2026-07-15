import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import LogoGeneratorTool from "@/components/tools/image/LogoGeneratorTool";

export const metadata = {
	title: "Free Logo Generator Online - No Signup | SopKit",
	description: "Edit, convert, and compress images with our free Logo Generator online. Crop, resize, and optimize photos in your browser with no signup. 100% free and secure.",
	keywords: "logo generator, free online tool, no signup, logo generator online, image, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/logo-generator",
	},
	openGraph: {
		title: "Free Logo Generator Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Logo Generator online. Crop, resize, and optimize photos in your browser with no signup. 100% free and secure.",
		url: "https://sopkit.github.io/logo-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Logo Generator Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Logo Generator online. Crop, resize, and optimize photos in your browser with no signup. 100% free and secure.",
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
