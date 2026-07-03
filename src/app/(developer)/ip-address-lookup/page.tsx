import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "What Is My IP Address - Free Public IP Lookup | SopKit",
	description: "Instantly check your public IPv4 or IPv6 IP address. See GeoIP location data, including country, city, ISP organization, zip code, and browser resolution. Secure & private.",
	alternates: {
		canonical: "https://sopkit.github.io/ip-address-lookup",
	},
	openGraph: {
		title: "What Is My IP Address - Free Public IP Lookup | SopKit",
		description: "Instantly check your public IPv4 or IPv6 IP address. See GeoIP location data, including country, city, ISP organization, zip code, and browser resolution. Secure & private.",
		url: "https://sopkit.github.io/ip-address-lookup",
		siteName: "SopKit",
		images: [{ url: "/og-images/developer-tools.png" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "What Is My IP Address - Free Public IP Lookup | SopKit",
		description: "Instantly check your public IPv4 or IPv6 IP address. See GeoIP location data, including country, city, ISP organization, zip code, and browser resolution. Secure & private.",
		images: ["/og-images/developer-tools.png"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/ip-address-lookup");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
