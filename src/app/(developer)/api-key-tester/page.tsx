import Link from "next/link";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { KeyRound, ShieldCheck, ChevronRight } from "lucide-react";
import { getAllTools } from "@/lib/tools";

export const metadata = {
	title: "Free API Key Tester & Credentials Checker Suite - SopKit",
	description: "Instantly test and validate your API keys safely inside your browser. Verify credentials for OpenAI, Gemini, DeepSeek, Stripe, Groq, Brevo, HubSpot, Twilio, and 30+ others.",
	alternates: {
		canonical: "https://sopkit.github.io/api-key-tester/",
	},
	robots: { index: true, follow: true },
};

export default async function ApiKeyTesterHubPage() {
	const tool = {
		id: "api-key-tester",
		name: "API Key Tester Suite",
		description: "Secure, client-side, browser-based API credentials validators for developers. Verify your OpenAI, Gemini, DeepSeek, Stripe, and other API keys instantly.",
		route: "/api-key-tester",
		category: "developer",
	};

	const allTools = getAllTools();
	const testers = allTools.filter(
		(t) => t.route && t.route.startsWith("/api-key-tester/")
	);

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<div className="space-y-8 font-sans">
				<div className="text-center max-w-2xl mx-auto space-y-3">
					<div className="flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm mx-auto w-fit">
						<ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
						<span>100% Client-Side Sandbox: Your credentials are never uploaded to any server.</span>
					</div>
					<p className="text-sm text-muted-foreground leading-relaxed">
						Ensure your developer API keys are active, correctly configured, and valid before deploying your code. 
						Select any third-party API service below to test your credentials using safe, local CORS requests.
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{testers.map((tester) => (
						<Link
							key={tester.id}
							href={tester.route}
							className="group block p-5 bg-card/25 border border-border/40 hover:border-primary/40 hover:bg-card/45 transition-all duration-300 rounded-xl relative overflow-hidden"
						>
							<div className="flex items-start justify-between gap-3 mb-2">
								<div className="p-2 bg-primary/10 text-primary rounded-lg">
									<KeyRound className="h-4 w-4" />
								</div>
								<span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider pt-1">
									{tester.route.split("/").pop()}
								</span>
							</div>
							<h3 className="font-bold text-sm text-card-foreground group-hover:text-primary transition-colors leading-snug mb-1.5">
								{tester.name}
							</h3>
							<p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
								{tester.description}
							</p>
							<div className="mt-4 flex items-center text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity gap-0.5">
								<span>Launch Validator</span>
								<ChevronRight className="h-3 w-3" />
							</div>
						</Link>
					))}
				</div>
			</div>
		</ToolLayout>
	);
}
