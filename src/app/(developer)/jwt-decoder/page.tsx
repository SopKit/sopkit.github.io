import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "JWT Decoder & Debugger Online Free | SopKit",
	description: "Decode JSON Web Tokens (JWT) locally in your browser to inspect header, payload, and signature. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/jwt-decoder",
	},
	openGraph: {
		title: "JWT Decoder & Debugger Online Free - No Signup | SopKit",
		description: "Decode JSON Web Tokens (JWT) locally in your browser to inspect header, payload, and signature. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/jwt-decoder",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "JWT Decoder & Debugger Online Free - Fast & Secure",
		description: "Decode JSON Web Tokens (JWT) locally in your browser to inspect header, payload, and signature. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/jwt-decoder");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
