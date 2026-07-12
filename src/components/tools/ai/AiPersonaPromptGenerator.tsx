"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Sparkles, User, MessageSquare, ShieldCheck, RotateCcw, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface Persona {
	id: string;
	title: string;
	role: string;
	coreInstructions: string;
}

export default function AiPersonaPromptGenerator() {
	const [selectedPersona, setSelectedPersona] = useState("developer");
	const [tone, setTone] = useState("professional");
	const [formatConstraint, setFormatConstraint] = useState("markdown");
	const [noPreamble, setNoPreamble] = useState(true);
	const [stepByStep, setStepByStep] = useState(false);
	const [customContext, setCustomContext] = useState("");
	const [compiledPrompt, setCompiledPrompt] = useState("");
	const [copied, setCopied] = useState(false);

	const personas: Record<string, Persona> = {
		developer: {
			id: "developer",
			title: "Senior Software Architect",
			role: "an expert Senior Software Architect and Developer with decades of engineering experience",
			coreInstructions: "Provide highly optimized, production-ready code. Explain your architectural choices concisely. Focus on performance, accessibility, clean design patterns, and security best practices.",
		},
		copywriter: {
			id: "copywriter",
			title: "SEO Copywriter",
			role: "a world-class SEO strategist and copywriter specializing in high-ranking content creation",
			coreInstructions: "Draft engaging, easy-to-read content optimized for targeted search keywords. Use standard heading structures, short paragraphs, rich vocabulary, and direct answers to maximize featured snippet opportunities.",
		},
		academic: {
			id: "academic",
			title: "Research Analyst & Scientist",
			role: "an objective Research Analyst and Academic Scientist",
			coreInstructions: "Summarize literature with factual accuracy, rigorous definitions, and professional citations. Maintain an unbiased, formal academic voice. Point out methodological caveats or research gaps clearly.",
		},
		marketing: {
			id: "marketing",
			title: "Direct Response Marketer",
			role: "a conversion-rate optimization (CRO) expert and direct response marketer",
			coreInstructions: "Write compelling, high-converting copy that addresses user pain points directly. Optimize call-to-actions, highlight core benefits, and structure information for scanning. Keep the focus entirely on user incentives.",
		},
		tutor: {
			id: "tutor",
			title: "Socratic Teacher & Tutor",
			role: "a Socratic teacher who guides learning through thoughtful questioning rather than giving answers away",
			coreInstructions: "Break down complex concepts into simple analogies. Ask guiding questions to help the user arrive at conclusions themselves. Praise correct reasoning and gently correct errors.",
		},
	};

	useEffect(() => {
		const persona = personas[selectedPersona] || personas.developer;
		
		let prompt = `You are to act as ${persona.role}.\n\n`;
		prompt += `### Core Persona Guidelines:\n`;
		prompt += `- ${persona.coreInstructions}\n`;
		
		// Add Tone
		if (tone === "professional") {
			prompt += `- Maintain a highly professional, polite, and authoritative tone.\n`;
		} else if (tone === "casual") {
			prompt += `- Write in a friendly, conversational, and accessible tone.\n`;
		} else if (tone === "explanatory") {
			prompt += `- Focus on teaching. Explain concepts thoroughly with step-by-step logical builds.\n`;
		} else if (tone === "concise") {
			prompt += `- Be extremely brief and direct. Omit any unnecessary fluff or repetitive phrasing.\n`;
		}

		// Formatting constraints
		prompt += `\n### Formatting Rules:\n`;
		if (formatConstraint === "markdown") {
			prompt += `- Format your responses using clean Markdown headers (H2, H3), bullet points, and code blocks for readability.\n`;
		} else if (formatConstraint === "raw-text") {
			prompt += `- Deliver the output in raw plain paragraphs with no markdown styling.\n`;
		}

		if (noPreamble) {
			prompt += `- Do not write any introductory or conversational preamble (e.g. do not say 'Sure, here is X' or 'I would be happy to help'). Start directly with the requested output.\n`;
			prompt += `- Do not add conversational closing remarks. End the response immediately at the end of the content.\n`;
		}

		if (stepByStep) {
			prompt += `- Before outputting the final result, write a brief, hidden step-by-step thinking block inside <thinking> tags outlining your plan.\n`;
		}

		if (customContext.trim()) {
			prompt += `\n### Specific Project Context:\n`;
			prompt += `${customContext.trim()}\n`;
		}

		setCompiledPrompt(prompt);
	}, [selectedPersona, tone, formatConstraint, noPreamble, stepByStep, customContext]);

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(compiledPrompt);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy text", err);
		}
	};

	const resetFields = () => {
		setSelectedPersona("developer");
		setTone("professional");
		setFormatConstraint("markdown");
		setNoPreamble(true);
		setStepByStep(false);
		setCustomContext("");
	};

	return (
		<div className="w-full max-w-4xl mx-auto space-y-8 font-sans">
			<Card className="border border-border/40 bg-card/30 backdrop-blur-md">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-xl font-black">
						<Award className="h-5 w-5 text-indigo-500" />
						AI Persona & System Prompt Generator
					</CardTitle>
					<CardDescription>
						Generate professional-grade system prompts and tailored persona instructions to inject into your ChatGPT or Claude chat boxes.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					
					{/* Choose Persona Grid */}
					<div className="space-y-3">
						<Label className="font-bold text-sm">Select AI Expert Persona</Label>
						<div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
							{Object.values(personas).map((p) => {
								const isSelected = selectedPersona === p.id;
								return (
									<button
										key={p.id}
										onClick={() => setSelectedPersona(p.id)}
										className={`p-3 text-left border rounded-xl transition-all duration-200 select-none ${
											isSelected
												? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
												: "border-border/40 hover:border-primary/20 bg-background/50 text-muted-foreground"
										}`}
									>
										<User className="h-4 w-4 mb-1.5" />
										<span className="text-xs block leading-tight">{p.title}</span>
									</button>
								);
							})}
						</div>
					</div>

					{/* Tone & Formatting */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
						
						{/* Tone Column */}
						<div className="space-y-2">
							<Label className="font-bold text-xs">Response Tone</Label>
							<select
								value={tone}
								onChange={(e) => setTone(e.target.value)}
								className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
							>
								<option value="professional">Professional & Authoritative</option>
								<option value="casual">Casual & Friendly</option>
								<option value="explanatory">Explanatory / Teaching-focused</option>
								<option value="concise">Ultra Concise & Direct</option>
							</select>
						</div>

						{/* Formatting Column */}
						<div className="space-y-2">
							<Label className="font-bold text-xs">Output Format Style</Label>
							<select
								value={formatConstraint}
								onChange={(e) => setFormatConstraint(e.target.value)}
								className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
							>
								<option value="markdown">Markdown (Headers, Bullet points)</option>
								<option value="raw-text">Raw Plain Text Paragraphs</option>
							</select>
						</div>

					</div>

					{/* Checkboxes for constraints */}
					<div className="space-y-3 pt-2">
						<Label className="font-bold text-xs">Behavioral Constraints</Label>
						<div className="flex flex-col sm:flex-row gap-4">
							<label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
								<input
									type="checkbox"
									checked={noPreamble}
									onChange={(e) => setNoPreamble(e.target.checked)}
									className="rounded border-input text-primary focus:ring-primary h-4 w-4 bg-background"
								/>
								<span>Exclude conversational filler (no "Sure, I can help...")</span>
							</label>

							<label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
								<input
									type="checkbox"
									checked={stepByStep}
									onChange={(e) => setStepByStep(e.target.checked)}
									className="rounded border-input text-primary focus:ring-primary h-4 w-4 bg-background"
								/>
								<span>Force step-by-step thinking block first</span>
							</label>
						</div>
					</div>

					{/* Custom context input */}
					<div className="space-y-2 pt-2">
						<Label className="font-bold text-xs flex items-center gap-1">
							<MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
							Custom Constraints / Project Context (Optional)
						</Label>
						<textarea
							placeholder="e.g. Focus on TypeScript 5, avoid external CSS frameworks, assume the reader is a junior developer."
							value={customContext}
							onChange={(e) => setCustomContext(e.target.value)}
							className="w-full min-h-[80px] p-3 rounded-md border border-input bg-background text-xs focus:outline-none focus:ring-1 focus:ring-ring resize-y leading-relaxed"
						/>
					</div>

					{/* Prompt Output Card */}
					<Card className="border border-indigo-500/20 bg-indigo-500/5 mt-6">
						<CardContent className="p-4 space-y-4">
							<div className="flex items-center justify-between">
								<span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
									<ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
									Copyable System Prompt Instruction Block
								</span>
								<div className="flex gap-2">
									<Button size="sm" onClick={copyToClipboard} className="bg-indigo-600 hover:bg-indigo-700 font-bold text-xs gap-1.5">
										{copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
										{copied ? "Copied!" : "Copy Instructions"}
									</Button>
									<Button size="sm" variant="outline" onClick={resetFields} className="text-xs gap-1">
										<RotateCcw className="h-3 w-3" />
										Reset
									</Button>
								</div>
							</div>
							
							<div className="p-3 bg-zinc-950/70 border border-border/40 rounded-lg select-all max-h-[300px] overflow-y-auto">
								<pre className="text-xs font-mono text-zinc-200 leading-relaxed whitespace-pre-wrap">
									{compiledPrompt}
								</pre>
							</div>
						</CardContent>
					</Card>

				</CardContent>
			</Card>
		</div>
	);
}
