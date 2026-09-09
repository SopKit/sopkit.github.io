import type { Metadata } from "next";
import { generateMetadata } from "@/lib/seo";
import PackagesGrid from "./PackagesGrid";

export const metadata: Metadata = generateMetadata({
	title: "SopKit Developer Packages — Zero-Dependency NPM Utilities",
	description: "Zero-dependency, strictly-typed @sopkit NPM packages for Base64, UUID, slug, password and color utilities. Native ESM + CJS dual-format, ultra-light bundles, free forever.",
	path: "/packages",
	image: "/og-images/packages.png",
	keywords: ["npm packages", "@sopkit", "typescript utilities", "zero dependency", "base64", "uuid", "slug generator"],
});

export default function PackagesPage() {
	return <PackagesGrid />;
}
