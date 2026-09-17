import { Check, Zap, Globe, Lock, HelpCircle } from "lucide-react";
import { SITE_CONFIG } from "@/constants/config";

export const ToolTrust = () => {
	return (
		<section
			aria-label="Trust indicators"
			className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-8 md:p-10 rounded-2xl bg-card/40 border border-border/50 backdrop-blur-md shadow-sm"
		>
			<div className="text-center space-y-3 group p-4 rounded-xl hover:bg-muted/30 transition-all duration-300">
				<div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 inline-flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm shadow-blue-500/20">
					<Zap className="w-6 h-6" />
				</div>
				<h3 className="font-bold text-base tracking-tight text-foreground">
					Instant Browser Execution
				</h3>
				<p className="text-xs text-muted-foreground leading-relaxed">
					Runs 100% locally in your browser memory for zero latency. No remote queues or server delays.
				</p>
			</div>
			<div className="text-center space-y-3 group p-4 rounded-xl hover:bg-muted/30 transition-all duration-300">
				<div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 inline-flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm shadow-emerald-500/20">
					<Lock className="w-6 h-6" />
				</div>
				<h3 className="font-bold text-base tracking-tight text-foreground">
					100% Private & Secure
				</h3>
				<p className="text-xs text-muted-foreground leading-relaxed">
					Your files and documents never leave your device. Zero data selling, zero tracking, and no server logs.
				</p>
			</div>
			<div className="text-center space-y-3 group p-4 rounded-xl hover:bg-muted/30 transition-all duration-300">
				<div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 inline-flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-sm shadow-purple-500/20">
					<Globe className="w-6 h-6" />
				</div>
				<h3 className="font-bold text-base tracking-tight text-foreground">
					Free Forever, No Signup
				</h3>
				<p className="text-xs text-muted-foreground leading-relaxed">
					No credit card, account creation, or subscriptions required. Unlimited access to all {SITE_CONFIG.toolCountString} tools.
				</p>
			</div>
		</section>
	);
};

export interface ToolFeaturesProps {
	features?: string[];
}

export const ToolFeatures = ({ features }: ToolFeaturesProps) => {
	if (!features || features.length === 0) return null;
	return (
		<section className="scroll-mt-24 space-y-6" aria-label="Features and benefits">
			<div>
				<h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground mb-2">
					Key Features & Capabilities
				</h2>
				<p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
					Engineered for speed, precision, and privacy with browser-native processing.
				</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{features.map((feature, idx) => (
					<div
						key={idx}
						className="flex items-start gap-4 p-5 rounded-xl bg-card border border-border/60 hover:border-blue-500/40 hover:shadow-md transition-all duration-200 group"
					>
						<div className="mt-0.5 w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 inline-flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
							<Check className="w-3.5 h-3.5" />
						</div>
						<span className="text-sm font-medium text-foreground leading-snug">
							{feature}
						</span>
					</div>
				))}
			</div>
		</section>
	);
};

export interface ToolStep {
	name: string;
	text: string;
}

export interface ToolStepsProps {
	steps?: ToolStep[];
	toolName: string;
}

export const ToolSteps = ({ steps, toolName }: ToolStepsProps) => {
	if (!steps || steps.length === 0) return null;
	return (
		<section
			className="scroll-mt-24 space-y-6"
			aria-label={`How to use ${toolName} step by step`}
		>
			<div>
				<h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground mb-2">
					How to Use {toolName} — Step by Step
				</h2>
				<p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
					Follow these quick steps to get your result in seconds with zero friction.
				</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
				{steps.map((step, idx) => (
					<div
						key={idx}
						className="relative p-6 rounded-2xl bg-card border border-border/60 hover:border-blue-500/30 hover:shadow-lg transition-all duration-300 group"
					>
						<div className="w-8 h-8 rounded-lg bg-blue-600 dark:bg-blue-500 text-white inline-flex items-center justify-center font-extrabold text-sm mb-4 shadow-md shadow-blue-500/20">
							{idx + 1}
						</div>
						<h3 className="text-base font-bold text-foreground mb-2 tracking-tight">
							{step.name}
						</h3>
						<p className="text-xs text-muted-foreground leading-relaxed">{step.text}</p>
					</div>
				))}
			</div>
		</section>
	);
};

export interface FAQ {
	question: string;
	answer: string;
}

export interface ToolFAQProps {
	faqs?: FAQ[];
	toolName: string;
}

export const ToolFAQ = ({ faqs, toolName }: ToolFAQProps) => {
	if (!faqs || faqs.length === 0) return null;
	return (
		<section
			className="scroll-mt-24 space-y-6"
			aria-label={`Frequently asked questions about ${toolName}`}
		>
			<div>
				<h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground mb-2 flex items-center gap-3">
					<div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 inline-flex items-center justify-center shrink-0">
						<HelpCircle className="w-4 h-4" />
					</div>
					Frequently Asked Questions
				</h2>
				<p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
					Common questions about {toolName}, security, supported formats, and performance.
				</p>
			</div>
			<div className="space-y-4">
				{faqs.map((faq, idx) => (
					<div
						key={idx}
						className="p-6 rounded-2xl bg-card border border-border/60 hover:border-blue-500/30 shadow-sm transition-all duration-200"
					>
						<h3 className="text-base font-bold text-foreground mb-2.5 tracking-tight flex items-start gap-2.5">
							<span className="text-blue-600 dark:text-blue-400 font-extrabold text-sm">Q:</span>
							<span>{faq.question}</span>
						</h3>
						<p className="text-xs md:text-sm text-muted-foreground leading-relaxed pl-5">
							{faq.answer}
						</p>
					</div>
				))}
			</div>
		</section>
	);
};
