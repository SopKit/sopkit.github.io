import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Free JWT Decoder & Debugger Online - No Signup | SopKit",
	description: "Format, minify, validate, and convert code snippets with our free JWT Decoder & Debugger online. Secure, local developer utility with no registration.",
	keywords: "jwt decoder & debugger, free online tool, no signup, jwt decoder & debugger online, developer, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/jwt-decoder",
	},
	openGraph: {
		title: "Free JWT Decoder & Debugger Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free JWT Decoder & Debugger online. Secure, local developer utility with no registration.",
		url: "https://sopkit.github.io/jwt-decoder",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free JWT Decoder & Debugger Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free JWT Decoder & Debugger online. Secure, local developer utility with no registration.",
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
