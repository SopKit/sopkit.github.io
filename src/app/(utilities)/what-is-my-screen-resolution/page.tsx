import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ScreenResolutionTool from "@/components/tools/built-ins/ScreenResolutionTool";

export const metadata = {
	title: "What Is My Screen Resolution Online Free - No Signup | SopKit",
	description: "Free what is my screen resolution tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/what-is-my-screen-resolution/",
	},
	openGraph: {
		title: "What Is My Screen Resolution Online Free - No Signup",
		description: "Free what is my screen resolution tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser",
		url: "https://sopkit.github.io/what-is-my-screen-resolution/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "What Is My Screen Resolution Online Free - Fast & Secure",
		description: "Free what is my screen resolution tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/what-is-my-screen-resolution");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ScreenResolutionTool />
		</ToolLayout>
	);
}
