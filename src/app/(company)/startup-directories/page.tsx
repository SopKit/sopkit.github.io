import type { Metadata } from "next";
import { generateMetadata } from "@/lib/seo";
import StartupDirectoriesClient from "./StartupDirectoriesClient";

export const metadata: Metadata = generateMetadata({
	title: "100+ Startup Directories to Submit Your SaaS | SopKit",
	description: "Curated, prioritized list of 100+ startup directories, review sites and communities to submit your software or AI tool. Filter by priority, cost and tag — free forever.",
	path: "/startup-directories",
});

export default function StartupDirectoriesPage() {
	return <StartupDirectoriesClient />;
}
