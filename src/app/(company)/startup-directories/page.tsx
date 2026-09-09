import type { Metadata } from "next";
import { generateMetadata } from "@/lib/seo";
import StartupDirectoriesClient from "./StartupDirectoriesClient";

export const metadata: Metadata = generateMetadata({
	title: "100+ Startup Directories — Submit Your SaaS & Get Traffic | SopKit",
	description: "Curated, prioritized list of 100+ startup directories, review sites and communities to submit your software or AI tool. Filter by priority, cost and tag — free forever.",
	path: "/startup-directories",
	keywords: ["startup directories", "submit startup", "saas directories", "product launch sites", "indie hackers", "product hunt alternatives"],
});

export default function StartupDirectoriesPage() {
	return <StartupDirectoriesClient />;
}
