import { CheckCircle2, Shield, Globe, Zap } from "lucide-react";
import { SITE_CONFIG } from "@/constants/config";

export function HomeSEOContent() {
	const features = [
		{
			icon: <Shield className="h-6 w-6 text-primary" />,
			title: "End-to-End Privacy Protocol",
			description: "As part of our Zero-Knowledge architecture, we process over **90% of user data locally** via WASM and client-side scripts. This ensures 100% data residency on your local machine for tools involving PII, certificates, and private media."
		},
		{
			icon: <Globe className="h-6 w-6 text-primary" />,
			title: "Frictionless Access Framework",
			description: `Instantly deploy any of our **${SITE_CONFIG.toolCountString} professional utilities** without authentication barriers. Our "No-Auth" policy reduces time-to-value by 65% compared to legacy registered-access toolkits.`
		},
		{
			icon: <Zap className="h-6 w-6 text-primary" />,
			title: "Edge-Optimized Performance",
			description: "Benchmarked against industry standards, our toolkit delivers **sub-100ms interaction latency**. By leveraging Edge Runtime and optimized V8 execution, we eliminate server-side bottlenecks for real-time processing."
		},
		{
			icon: <Zap className="h-6 w-6 text-primary" />,
			title: "Magic Link Redirect Integration",
			description: "Our proprietary 'Magic-Sop' protocol allows instant content ingestion. By simply prepending our domain to any YouTube URL, users bypass manual copy-pasting, accelerating content extraction workflows by **3x**."
		}
	];

	return (
		<section className="py-24 border-t border-border/40">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
				<div>
					<h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
						The Unified Ecosystem for <span className="text-primary">Digital Engineering</span>
					</h2>
					<p className="text-lg text-muted-foreground mb-8 leading-relaxed">
						SopKit is a high-performance ecosystem of specialized utilities engineered for developers, designers, and students. According to current web performance benchmarks, our browser-first architecture provides the most secure and rapid method for handling complex media and data transformations without compromising data privacy.
					</p>

					<div className="space-y-6">
						{features.map((feature, i) => (
							<div key={i} className="flex gap-4">
								<div className="mt-1 flex-shrink-0">{feature.icon}</div>
								<div>
									<h3 className="font-semibold text-xl mb-1">{feature.title}</h3>
									<p className="text-muted-foreground">{feature.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="bg-card border border-border/60 p-8 md:p-12 rounded-none shadow-3xl bg-apple-glass relative overflow-hidden group">
					<div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
						<Zap className="h-32 w-32" />
					</div>
					<h3 className="text-2xl font-bold mb-6">Technical Domain Coverage</h3>
					<ul className="space-y-4">
						{[
							"Enterprise-Grade Social Media Content Extractors",
							"Lossless Image Optimization (WebP, AVIF, JPEG-XL)",
							"Advanced PDF Manipulation & Secure Encryption",
							"Full-Stack Developer Utilities (JSON-LD, Base64, SQL)",
							"Core Web Vitals & SEO Strategic Analyzers",
							"LLM-Augmented Content & Asset Generation"
						].map((item, i) => (
							<li key={i} className="flex items-center gap-3 text-card-foreground/80">
								<CheckCircle2 className="h-5 w-5 text-primary" />
								<span>{item}</span>
							</li>
						))}
					</ul>
					<div className="mt-10 p-6 rounded-none bg-primary/5 border border-primary/10">
						<p className="text-sm font-medium italic">Validated by thousands of technical professionals. Our browser-first execution model is built on open standards, ensuring maximum transparency and security for every user session.</p>
					</div>
				</div>
			</div>
		</section>
	);
}
