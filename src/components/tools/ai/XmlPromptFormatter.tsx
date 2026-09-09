"use client";

import { useState, useMemo, type ReactNode } from "react";
import { Copy, Check, CodeXml, Lightbulb, FolderTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface Section {
	key: string;
	tag: string;
	label: string;
	placeholder: string;
}

const SECTIONS: Section[] = [
	{ key: "context", tag: "context", label: "Context / Background", placeholder: "Background documents, data, or reference material…" },
	{ key: "instructions", tag: "instructions", label: "Instructions / Task", placeholder: "What should Claude do with the context above?" },
	{ key: "examples", tag: "examples", label: "Examples", placeholder: "One or more input/output examples demonstrating the task…" },
	{ key: "thinking_instructions", tag: "thinking_instructions", label: "Thinking Instructions", placeholder: "Think step by step inside <thinking> tags before answering." },
	{ key: "output_format", tag: "output_format", label: "Output Format", placeholder: "Respond with a JSON object containing keys …" },
];

const DEFAULT_THINKING = "Think step by step inside <thinking> tags before answering. Evaluate multiple approaches, then commit to the strongest one.";

function Highlighted({ code }: { code: string }): ReactNode[] {
	return code.split("\n").map((line, li) => (
		<span key={li}>
			{line.split(/(<\/?[a-zA-Z][\w-]*>)/g).map((token, ti) =>
				/^<\/?[a-zA-Z][\w-]*>$/.test(token) ? (
					<span key={ti} className={token.startsWith("</") ? "text-violet-600 dark:text-violet-400 font-semibold" : "text-sky-600 dark:text-sky-400 font-semibold"}>
						{token}
					</span>
				) : token.includes("<") || token.includes(">") ? (
					<FragmentInline key={ti} text={token} />
				) : (
					<span key={ti}>{token}</span>
				),
			)}
			{"\n"}
		</span>
	));
}

function FragmentInline({ text }: { text: string }): ReactNode[] {
	const parts = text.split(/(<\/?[a-zA-Z][\w-]*(?:\s*\/)?>)/g);
	return parts.map((p, i) =>
		/^<\/?[a-zA-Z][\w-]*(?:\s\/)?>$/.test(p) ? (
			<span key={i} className={p.startsWith("</") ? "text-violet-600 dark:text-violet-400 font-semibold" : "text-sky-600 dark:text-sky-400 font-semibold"}>{p}</span>
		) : (
			<span key={i}>{p}</span>
		),
	);
}

interface TreeNode {
	name: string;
	children: TreeNode[];
	snippet?: string;
}

function parseTopLevel(text: string, depth = 0): TreeNode[] {
	if (depth > 4 || !text) return [];
	const nodes: TreeNode[] = [];
	const regex = /<([a-zA-Z][\w-]*)>([\s\S]*?)<\/\1>/g;
	let match: RegExpExecArray | null;
	while ((match = regex.exec(text)) !== null) {
		const inner = match[2].trim();
		const children = parseTopLevel(inner, depth + 1);
		nodes.push({
			name: match[1],
			children,
			snippet: children.length === 0 && inner ? inner.slice(0, 80) + (inner.length > 80 ? "…" : "") : undefined,
		});
	}
	return nodes;
}

export default function XmlPromptFormatter() {
	const [texts, setTexts] = useState<Record<string, string>>({
		context: "",
		instructions: "",
		examples: "",
		thinking_instructions: DEFAULT_THINKING,
		output_format: "",
	});
	const [enabled, setEnabled] = useState<Record<string, boolean>>({
		context: true,
		instructions: true,
		examples: false,
		thinking_instructions: false,
		output_format: true,
	});
	const [parsedInput, setParsedInput] = useState("");
	const [copied, setCopied] = useState(false);

	const composed = useMemo(() => {
		const blocks: string[] = [];
		for (const section of SECTIONS) {
			if (enabled[section.key]) {
				blocks.push(`<${section.tag}>\n${(texts[section.key] || "").trim()}\n</${section.tag}>`);
			}
		}
		return blocks.join("\n\n");
	}, [texts, enabled]);

	const tree = useMemo(() => parseTopLevel(parsedInput), [parsedInput]);

	const handleCopy = () => {
		navigator.clipboard.writeText(composed);
		setCopied(true);
		toast.success("Structured prompt copied to clipboard!");
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="space-y-8 max-w-5xl mx-auto">
			<Tabs defaultValue="build">
				<TabsList className="flex-wrap h-auto">
					<TabsTrigger value="build" className="gap-1.5"><CodeXml className="h-3.5 w-3.5" />Build</TabsTrigger>
					<TabsTrigger value="parse" className="gap-1.5"><FolderTree className="h-3.5 w-3.5" />Parse Existing</TabsTrigger>
				</TabsList>

				<TabsContent value="build" className="space-y-6 pt-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
						<div className="space-y-4">
							{SECTIONS.map((section) => (
								<div key={section.key} className={`p-4 rounded-xl border transition-colors ${enabled[section.key] ? "border-border bg-card shadow-sm" : "border-dashed border-border/60 opacity-60"}`}>
									<div className="flex items-center gap-3 mb-2">
										<Checkbox
											id={`enable-${section.key}`}
											checked={enabled[section.key]}
											onCheckedChange={(v) => setEnabled((prev) => ({ ...prev, [section.key]: v === true }))}
										/>
										<Label htmlFor={`enable-${section.key}`} className="text-sm font-semibold cursor-pointer flex-1">{section.label}</Label>
										<code className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">&lt;{section.tag}&gt;</code>
									</div>
									<Textarea
										value={texts[section.key]}
										onChange={(e) => setTexts((prev) => ({ ...prev, [section.key]: e.target.value }))}
										placeholder={section.placeholder}
										disabled={!enabled[section.key]}
										className="min-h-[64px] text-sm resize-y"
									/>
								</div>
							))}
						</div>

						<div className="space-y-4 lg:sticky lg:top-6">
							<div className="p-5 rounded-2xl bg-card border border-border/60 shadow-sm space-y-3">
								<div className="flex items-center justify-between">
									<h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Composed Prompt</h4>
									<Button size="sm" variant="outline" disabled={!composed} onClick={handleCopy} className="h-7 text-xs gap-1.5">
										{copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
										Copy
									</Button>
								</div>
								<pre className="p-3.5 rounded-xl bg-muted/50 border border-border/40 font-mono text-[12px] leading-relaxed whitespace-pre-wrap max-h-[480px] overflow-y-auto text-foreground">
									{composed ? <Highlighted code={composed} /> : "Enable sections on the left to compose your structured prompt."}
								</pre>
							</div>
							<div className="flex gap-2.5 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300">
								<Lightbulb className="h-4 w-4 shrink-0 mt-0.5" />
								<p className="text-xs leading-relaxed">Anthropic&apos;s documented guidance recommends wrapping distinct prompt parts in XML tags so Claude can clearly separate instructions from data — tagged structure measurably reduces instruction confusion and improves output consistency on complex prompts.</p>
							</div>
						</div>
					</div>
				</TabsContent>

				<TabsContent value="parse" className="space-y-6 pt-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
						<div className="space-y-2 p-5 rounded-2xl bg-card border border-border/60 shadow-sm">
							<Label htmlFor="parse-input" className="text-xs font-semibold">Paste an existing XML-tagged prompt</Label>
							<Textarea id="parse-input" value={parsedInput} onChange={(e) => setParsedInput(e.target.value)} placeholder={"<context>\n…\n</context>\n\n<instructions>\n…\n</instructions>"} className="min-h-[280px] text-sm resize-y font-mono" />
						</div>
						<div className="p-5 rounded-2xl bg-card border border-border/60 shadow-sm">
							<h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">Detected Structure</h4>
							{tree.length === 0 ? (
								<p className="text-sm text-muted-foreground py-8 text-center">No top-level XML tags detected yet.</p>
							) : (
								<ul className="space-y-2">
									<TreeView nodes={tree} depth={0} />
								</ul>
							)}
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}

function TreeView({ nodes, depth }: { nodes: TreeNode[]; depth: number }) {
	return (
		<>
			{nodes.map((node, i) => (
				<li key={`${node.name}-${i}`} style={{ paddingLeft: `${depth * 16}px` }}>
					<div className="flex items-baseline gap-2 flex-wrap">
						<code className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">&lt;{node.name}&gt;</code>
						{node.snippet && <span className="text-[11px] text-muted-foreground truncate max-w-[240px]">{node.snippet}</span>}
						{node.children.length > 0 && <span className="text-[10px] px-1.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 font-semibold">{node.children.length} nested</span>}
					</div>
					{node.children.length > 0 && <ul className="mt-1 space-y-1 border-l border-border/50 ml-1.5"><TreeView nodes={node.children} depth={depth + 1} /></ul>}
				</li>
			))}
		</>
	);
}
