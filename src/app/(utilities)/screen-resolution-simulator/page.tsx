import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ScreenResolutionTool from "@/components/tools/built-ins/ScreenResolutionTool";

export const metadata = {
	title: "Screen Resolution Simulator Online Free - No Signup | SopKit",
	description: "Free screen resolution simulator tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/screen-resolution-simulator/",
	},
	openGraph: {
		title: "Screen Resolution Simulator Online Free - No Signup",
		description: "Free screen resolution simulator tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-",
		url: "https://sopkit.github.io/screen-resolution-simulator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Screen Resolution Simulator Online Free - Fast & Secure",
		description: "Free screen resolution simulator tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/screen-resolution-simulator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ScreenResolutionTool />
		</ToolLayout>
	);
}
