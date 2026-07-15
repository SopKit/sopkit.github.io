import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Free Advanced Favicon Generator Online - No Signup | SopKit",
	description: "Edit, convert, and compress images with our free Advanced Favicon Generator online. Crop, resize, and optimize photos in your browser with no signup. 100% free.",
	keywords: "advanced favicon generator, free online tool, no signup, advanced favicon generator online, image, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/favicon-generator-pro",
	},
	openGraph: {
		title: "Free Advanced Favicon Generator Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Advanced Favicon Generator online. Crop, resize, and optimize photos in your browser with no signup. 100% free.",
		url: "https://sopkit.github.io/favicon-generator-pro",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Advanced Favicon Generator Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Advanced Favicon Generator online. Crop, resize, and optimize photos in your browser with no signup. 100% free.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/favicon-generator-pro");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
