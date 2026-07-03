"use client";

import React, { useState } from "react";
import { 
	CodeIcon, 
	CopyIcon, 
	CheckCircleIcon,
	TrashIcon,
	FileTextIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "../shared/WorkspaceComponents";
import { toast } from "sonner";

export default function HtmlToXmlEntitiesTool() {
	const [input, setInput] = useState(`<div class="header">
  <h1>SopKit XML Converter</h1>
  <p>Escape & display special tags safely.</p>
</div>`);
	const [output, setOutput] = useState("");
	const [copied, setCopied] = useState(false);

	const handleEscape = () => {
		const escaped = input
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&apos;");
		setOutput(escaped);
		toast.success("HTML characters escaped!");
	};

	const handleUnescape = () => {
		const unescaped = input
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			.replace(/&quot;/g, '"')
			.replace(/&apos;/g, "'")
			.replace(/&amp;/g, "&");
		setOutput(unescaped);
		toast.success("XML entities unescaped!");
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(output);
		setCopied(true);
		toast.success("Result copied!");
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 gap-6 min-h-[350px]">
				{/* Input Panel */}
				<GlassCard className="p-4 flex flex-col space-y-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
							<CodeIcon className="h-4 w-4" />
							<span>Input Text</span>
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
						className="w-full min-h-[120px] p-4 bg-muted/40 border border-border/40 rounded-2xl font-mono text-sm leading-relaxed text-foreground focus:outline-none"
						placeholder="Paste HTML or escaped XML here..."
					/>
					<div className="flex gap-2 pt-2">
						<Button onClick={handleEscape} className="flex-1 font-semibold">
							Escape HTML
						</Button>
						<Button onClick={handleUnescape} variant="outline" className="flex-1 font-semibold">
							Unescape Entities
						</Button>
					</div>
				</GlassCard>

				{/* Output Panel */}
				<GlassCard className="p-4 flex flex-col space-y-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
							<FileTextIcon className="h-4 w-4 text-primary" />
							<span>Result</span>
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
						className="w-full min-h-[120px] p-4 bg-muted/20 border border-border/20 rounded-2xl font-mono text-sm leading-relaxed text-foreground focus:outline-none"
						placeholder="Result output will appear here..."
					/>
				</GlassCard>
			</div>
		</div>
	);
}
