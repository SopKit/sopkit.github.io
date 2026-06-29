import { permanentRedirect, redirect } from "next/navigation";
import { getAllTools } from "@/lib/tools";

interface PageProps {
	params: Promise<{ slug: string }>;
}


export const metadata = {
	title: "Tools/[Slug] Online Free | SopKit",
	description: "Free online Tools/[Slug] tool. Fast, secure, and privacy-focused browser utility. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/tools/[slug]/",
	},
	openGraph: {
		title: "Tools/[Slug] Online Free - No Signup | SopKit",
		description: "Free online Tools/[Slug] tool. Fast, secure, and privacy-focused browser utility. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/tools/[slug]",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Tools/[Slug] Online Free - Fast & Secure",
		description: "Free online Tools/[Slug] tool. Fast, secure, and privacy-focused browser utility. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolsSlugPage({ params }: PageProps) {
	const { slug } = await params;
	const tool = getAllTools().find(t => t.id === slug || t.route === `/${slug}`);

	if (!tool) {
		// Let Next.js handle 404
		redirect("/not-found");
	}

	// Redirect to the canonical tool route (e.g., /image-compressor)
	permanentRedirect(tool.route);
}

export async function generateStaticParams() {
	const slugs = new Set<string>();
	getAllTools().forEach((t) => {
		if (t.id) slugs.add(t.id);
		if (t.route) slugs.add(t.route.replace(/^\//, ""));
	});
	return Array.from(slugs).map((slug) => ({ slug }));
}
