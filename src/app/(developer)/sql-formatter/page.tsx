import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Free SQL Formatter & Beautifier Online - No Signup | SopKit",
	description: "Format, minify, validate, and convert code snippets with our free SQL Formatter & Beautifier online. Secure, local developer utility with no registration.",
	keywords: "sql formatter & beautifier, free online tool, no signup, sql formatter & beautifier online, developer, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/sql-formatter",
	},
	openGraph: {
		title: "Free SQL Formatter & Beautifier Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free SQL Formatter & Beautifier online. Secure, local developer utility with no registration.",
		url: "https://sopkit.github.io/sql-formatter",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free SQL Formatter & Beautifier Online - No Signup | SopKit",
		description: "Format, minify, validate, and convert code snippets with our free SQL Formatter & Beautifier online. Secure, local developer utility with no registration.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/sql-formatter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
