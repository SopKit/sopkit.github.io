import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSafeHttp from "@/components/tools/built-ins/BuiltInSafeHttp";

export const metadata = {
	title: "Free Get HTTP Headers Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Get HTTP Headers online. Fast, secure browser-based utility with no registration. No registration needed.",
	keywords: "get http headers, free online tool, no signup, get http headers online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/get-http-headers",
	},
	openGraph: {
		title: "Free Get HTTP Headers Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Get HTTP Headers online. Fast, secure browser-based utility with no registration. No registration needed.",
		url: "https://sopkit.github.io/get-http-headers",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Get HTTP Headers Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Get HTTP Headers online. Fast, secure browser-based utility with no registration. No registration needed.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/get-http-headers");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInSafeHttp toolId="get-http-headers" />
		</ToolLayout>
	);
}
