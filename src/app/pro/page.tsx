import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";

// Retired paid tier: /pro permanently moved to the free tools directory.
// Server redirect (no client JS, no indexable shell).
export const metadata: Metadata = {
	title: "SopKit Pro — Now 100% Free",
	description: "SopKit has retired the paid Pro tier. All tools are now 100% free with no signup required.",
	alternates: { canonical: "https://sopkit.github.io/tools/" },
	robots: { index: false, follow: true },
};

export default function ProRedirectPage() {
	permanentRedirect("/tools/");
}
