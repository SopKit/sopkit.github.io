"use client";

import React, { useState, useEffect } from "react";
import { 
	TypeIcon, 
	CopyIcon, 
	CheckCircleIcon,
	TrashIcon,
	FileTextIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "../shared/WorkspaceComponents";
import { toast } from "sonner";

export default function SlugToTextTool() {
	const [input, setInput] = useState("my-seo-friendly-url-slug");
	const [output, setOutput] = useState("");
	const [caseFormat, setCaseFormat] = useState("title"); // title, sentence, upper, lower
	const [copied, setCopied] = useState(false);

	const convertSlug = (slugStr: string, format: string) => {
		if (!slugStr.trim()) {
			setOutput("");
			return;
		}

		// Replace hyphens and underscores with spaces
		let words = slugStr.trim().replace(/[-_]+/g, " ").split(/\s+/);

		let result = "";
		if (format === "lower") {
			result = words.join(" ").toLowerCase();
		} else if (format === "upper") {
			result = words.join(" ").toUpperCase();
		} else if (format === "sentence") {
			const sentence = words.join(" ").toLowerCase();
			result = sentence.charAt(0).toUpperCase() + sentence.slice(1);
		} else {
			// Title Case
			result = words
				.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
				.join(" ");
		}

		setOutput(result);
	};

	useEffect(() => {
		convertSlug(input, caseFormat);
	}, [input, caseFormat]);

	const copyToClipboard = () => {
		navigator.clipboard.writeText(output);
		setCopied(true);
		toast.success("Text output copied!");
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 gap-6 min-h-[350px]">
				{/* Input Panel */}
				<GlassCard className="p-4 flex flex-col space-y-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
							<TypeIcon className="h-4 w-4" />
							<span>Slug Input</span>
						</div>
						<Button 
							variant="ghost" 
							size="icon" 
							onClick={() => setInput("")}
							className="h-8 w-8 text-muted-foreground hover:text-destructive"
						>
							<TrashIcon className="h-4 w-4" />
						</Button>
					</div>
					<textarea
						value={input}
						onChange={(e) => setInput(e.target.value)}
						className="w-full min-h-[100px] p-4 bg-muted/40 border border-border/40 rounded-2xl font-mono text-sm leading-relaxed text-foreground focus:outline-none"
						placeholder="Enter URL slug here (e.g. 'my-url-slug')..."
					/>
					
					{/* Case Selection Buttons */}
					<div className="flex flex-wrap gap-2 pt-2">
						{["title", "sentence", "upper", "lower"].map((fmt) => (
							<Button
								key={fmt}
								variant={caseFormat === fmt ? "default" : "outline"}
								size="sm"
								onClick={() => setCaseFormat(fmt)}
								className="capitalize font-semibold"
							>
								{fmt} Case
							</Button>
						))}
					</div>
				</GlassCard>

				{/* Output Panel */}
				<GlassCard className="p-4 flex flex-col space-y-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
							<FileTextIcon className="h-4 w-4 text-primary" />
							<span>Readable Text Output</span>
						</div>
						<Button 
							size="sm" 
							onClick={copyToClipboard}
							disabled={!output}
							className="gap-1.5"
						>
							{copied ? (
								<CheckCircleIcon className="h-4 w-4 text-green-400" />
							) : (
								<CopyIcon className="h-4 w-4" />
							)}
							{copied ? "Copied" : "Copy Result"}
						</Button>
					</div>
					<textarea
						readOnly
						value={output}
						className="w-full min-h-[100px] p-4 bg-muted/20 border border-border/20 rounded-2xl font-sans text-base leading-relaxed text-foreground focus:outline-none"
						placeholder="Compiled text will appear here..."
					/>
				</GlassCard>
			</div>
		</div>
	);
}
