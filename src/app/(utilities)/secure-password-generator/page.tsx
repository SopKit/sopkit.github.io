import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Secure Password Generator Online Free | SopKit",
	description: "Create strong and cryptographically secure passwords locally in your browser. Fully customizable length, character sets, and instant strength indicators.",
	alternates: {
		canonical: "https://sopkit.github.io/secure-password-generator/",
	},
	openGraph: {
		title: "Secure Password Generator Online Free | SopKit",
		description: "Create strong and cryptographically secure passwords locally in your browser. Fully customizable length, character sets, and instant strength indicators.",
		url: "https://sopkit.github.io/secure-password-generator/",
		siteName: "SopKit",
		images: [{ url: "/og-images/developer-tools.png" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Secure Password Generator Online Free | SopKit",
		description: "Create strong and cryptographically secure passwords locally in your browser. Fully customizable length, character sets, and instant strength indicators.",
		images: ["/og-images/developer-tools.png"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/secure-password-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
