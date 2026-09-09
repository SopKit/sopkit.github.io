"use client";

import {
	Braces,
	Check,
	Copy,
	Eye,
	FolderOpen,
	Save,
	Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const VAR_REGEX = /\{\{\s*([a-zA-Z0-9_ -]+?)\s*\}\}/g;

interface Preset {
	name: string;
	icon: string;
	template: string;
}

const PRESETS: Preset[] = [
	{
		name: "Blog Post Outline",
		icon: "✍️",
		template: `You are an experienced content strategist and SEO writer.

Write a detailed outline for a blog post about {{topic}}.
Target audience: {{audience}}.
Tone of voice: {{tone}}.

Requirements:
- Include a compelling H1 title and 5-7 H2 sections
- Add 2-3 bullet points under each section
- Suggest a meta description under 155 characters
- Do not include fluff or generic filler

Output the result as clean Markdown.`,
	},
	{
		name: "Code Review",
		icon: "🔍",
		template: `Act as a senior {{language}} engineer performing a thorough code review.

Review the following code with focus on:
1. Correctness and edge cases
2. Performance implications
3. Security vulnerabilities
4. Readability and naming

Code:
\`\`\`{{language}}
{{code}}
\`\`\`

Constraints:
- Be specific: reference exact lines
- Classify each finding as [critical], [warning], or [nit]
- Suggest a concrete fix for every issue

Format the output as a Markdown table followed by prioritized action items.`,
	},
	{
		name: "Cold Email",
		icon: "📧",
		template: `You are a B2B copywriter who writes short cold emails that get replies.

Write a cold email from {{sender_name}} at {{sender_company}} to {{prospect_role}} at {{prospect_industry}}.
Goal: book a 15-minute call about {{offering}}.
Pain point to lead with: {{pain_point}}.

Rules:
- Maximum 120 words
- One clear call to action
- No buzzwords, no "I hope this email finds you well"
- Subject line under 6 words

Output format: Subject line, blank line, then the email body.`,
	},
	{
		name: "Product Description",
		icon: "🛍️",
		template: `You are an e-commerce conversion copywriter.

Write a product description for {{product_name}}, which is {{product_category}}.
Key features: {{features}}.
Ideal customer: {{ideal_customer}}.

Structure:
- Hook (1 sentence)
- Benefits-first paragraph (3-4 sentences)
- 4-5 feature bullets translated into benefits
- A single-sentence guarantee or risk reversal

Constraints: max 200 words, no exclamation marks, reading level grade 7. Output in Markdown.`,
	},
	{
		name: "Study Explainer",
		icon: "🎓",
		template: `You are a patient tutor explaining concepts to a {{education_level}} student.

Explain {{concept}} from first principles.

Requirements:
- Start with a one-sentence plain-language definition
- Use the analogy: {{analogy_hint}}
- Walk through one worked example step by step
- List 3 common misconceptions and why they are wrong
- End with 2 practice questions (answers hidden below a spoiler line)

Tone: encouraging, never condescending. Format in Markdown with clear headings.`,
	},
	{
		name: "Meeting Summary",
		icon: "📋",
		template: `You are an executive assistant producing meeting summaries.

Summarize the transcript below for attendees of the {{meeting_type}} held on {{date}}.

Transcript:
{{transcript}}

Output format (Markdown):
## Decisions Made
- …

## Action Items
| Owner | Task | Deadline |
|---|---|---|

## Open Questions
- …

Rules: do not invent facts, keep it under 300 words, quote owners exactly as named.`,
	},
];

const STORAGE_KEY = "sopkit-prompt-templates";

interface SavedTemplate {
	name: string;
	template: string;
}

function prettyVar(v: string): string {
	return v.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function PromptTemplateGenerator() {
	const [template, setTemplate] = useState(PRESETS[0].template);
	const [values, setValues] = useState<Record<string, string>>({});
	const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);
	const [savedName, setSavedName] = useState("");
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) setSavedTemplates(JSON.parse(raw));
		} catch {
			setSavedTemplates([]);
		}
	}, []);

	const variables = useMemo(() => {
		const found = new Set<string>();
		for (const m of template.matchAll(VAR_REGEX)) found.add(m[1].trim());
		return Array.from(found);
	}, [template]);

	const preview = useMemo(() => {
		let out = template;
		for (const v of variables) {
			const val = values[v]?.trim();
			out = out.replace(
				new RegExp(
					`\\{\\{\\s*${v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\}\\}`,
					"g",
				),
				val || `[${prettyVar(v)}]`,
			);
		}
		return out;
	}, [template, values, variables]);

	const filledCount = variables.filter((v) => values[v]?.trim()).length;

	const persist = (next: SavedTemplate[]) => {
		setSavedTemplates(next);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
	};

	const handleSave = () => {
		const name =
			savedName.trim() || `Custom ${new Date().toLocaleTimeString()}`;
		persist([
			...savedTemplates.filter((t) => t.name !== name),
			{ name, template },
		]);
		setSavedName("");
		toast.success(`Saved "${name}" to this browser`);
	};

	const handleLoad = (t: SavedTemplate) => {
		setTemplate(t.template);
		setValues({});
		toast.info(`Loaded "${t.name}"`);
	};

	const handleDelete = (name: string) => {
		persist(savedTemplates.filter((t) => t.name !== name));
		toast.info(`Deleted "${name}"`);
	};

	const handleCopy = () => {
		if (!preview.trim()) return;
		if (navigator.clipboard?.writeText) {
			navigator.clipboard
				.writeText(preview)
				.then(() => toast.success("Copied to clipboard"))
				.catch(() => toast.error("Copy failed"));
		} else {
			toast.error("Clipboard unavailable");
			return;
		}
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="space-y-8 max-w-5xl mx-auto">
			<div className="flex flex-wrap gap-2">
				{PRESETS.map((p) => (
					<Button
						key={p.name}
						variant="outline"
						size="sm"
						onClick={() => {
							setTemplate(p.template);
							setValues({});
						}}
						className="rounded-full text-xs gap-1.5 h-8 border-border/60"
					>
						<span aria-hidden>{p.icon}</span> {p.name}
					</Button>
				))}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<div className="space-y-6">
					<div className="space-y-3 p-6 rounded-2xl bg-card border border-border/60 shadow-sm">
						<div className="flex items-center justify-between">
							<Label htmlFor="tpl" className="text-sm font-bold">
								Template
							</Label>
							<Badge variant="secondary" className="gap-1 text-[10px]">
								<Braces className="h-3 w-3" /> {variables.length} variables
							</Badge>
						</div>
						<Textarea
							id="tpl"
							value={template}
							onChange={(e) => setTemplate(e.target.value)}
							className="min-h-[220px] font-mono text-xs leading-relaxed"
							placeholder={"Use {{variable_name}} placeholders…"}
						/>
					</div>

					{variables.length > 0 && (
						<div className="space-y-3 p-6 rounded-2xl bg-card border border-border/60 shadow-sm">
							<div className="flex items-center justify-between">
								<h3 className="text-sm font-bold">Fill Variables</h3>
								<span className="text-[11px] text-muted-foreground tabular-nums">
									{filledCount}/{variables.length} filled
								</span>
							</div>
							<div className="space-y-3">
								{variables.map((v) => (
									<div key={v} className="space-y-1">
										<Label htmlFor={`var-${v}`} className="text-xs">
											{prettyVar(v)}
										</Label>
										<Input
											id={`var-${v}`}
											value={values[v] ?? ""}
											onChange={(e) =>
												setValues((prev) => ({ ...prev, [v]: e.target.value }))
											}
											placeholder={`Enter ${prettyVar(v).toLowerCase()}…`}
											className="h-9 text-sm"
										/>
									</div>
								))}
							</div>
						</div>
					)}

					<div className="space-y-3 p-6 rounded-2xl bg-card border border-border/60 shadow-sm">
						<h3 className="text-sm font-bold flex items-center gap-1.5">
							<Save className="h-3.5 w-3.5 text-violet-500" /> My Templates{" "}
							<span className="text-[11px] font-normal text-muted-foreground">
								(localStorage)
							</span>
						</h3>
						<div className="flex gap-2">
							<Input
								value={savedName}
								onChange={(e) => setSavedName(e.target.value)}
								placeholder="Template name…"
								className="h-9 text-sm"
							/>
							<Button size="sm" onClick={handleSave} className="h-9 px-3">
								Save
							</Button>
						</div>
						{savedTemplates.length === 0 ? (
							<p className="text-xs text-muted-foreground">
								No saved templates yet.
							</p>
						) : (
							<ul className="space-y-1.5">
								{savedTemplates.map((t) => (
									<li
										key={t.name}
										className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/50 border border-border/40"
									>
										<button
											type="button"
											onClick={() => handleLoad(t)}
											className="flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-violet-600 dark:hover:text-violet-400 truncate"
										>
											<FolderOpen className="h-3.5 w-3.5 shrink-0" /> {t.name}
										</button>
										<button
											type="button"
											onClick={() => handleDelete(t.name)}
											aria-label={`Delete ${t.name}`}
											className="text-muted-foreground hover:text-red-500 shrink-0"
										>
											<Trash2 className="h-3.5 w-3.5" />
										</button>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>

				<div className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm lg:sticky lg:top-6 self-start w-full flex flex-col">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-sm font-bold flex items-center gap-1.5">
							<Eye className="h-4 w-4 text-emerald-500" /> Live Preview
						</h3>
						<Button
							size="sm"
							variant="outline"
							onClick={handleCopy}
							disabled={!preview.trim()}
							className="h-7 text-xs gap-1.5"
						>
							{copied ? (
								<Check className="h-3.5 w-3.5 text-emerald-500" />
							) : (
								<Copy className="h-3.5 w-3.5" />
							)}{" "}
							Copy Filled
						</Button>
					</div>
					<pre className="flex-1 min-h-[420px] max-h-[70vh] overflow-auto p-4 rounded-xl bg-muted/50 border border-border/40 font-mono text-xs leading-relaxed whitespace-pre-wrap">
						{preview || "Your filled prompt appears here."}
					</pre>
					<p className="mt-3 text-[11px] text-muted-foreground">
						Unfilled variables appear as{" "}
						<span className="font-mono text-violet-600 dark:text-violet-400">
							[Bracketed Names]
						</span>{" "}
						so you can spot gaps before sending.
					</p>
				</div>
			</div>
		</div>
	);
}
