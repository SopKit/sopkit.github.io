"use client";

import React, { useState } from "react";
import { 
	LinkIcon, 
	CopyIcon, 
	CheckCircleIcon,
	TrashIcon,
	FileTextIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "../shared/WorkspaceComponents";
import { toast } from "sonner";

export default function UrlEncoderDecoderTool() {
	const [input, setInput] = useState("https://sopkit.github.io/search?q=hello world & query=true");
	const [output, setOutput] = useState("");
	const [copied, setCopied] = useState(false);

	const handleEncode = () => {
		try {
			setOutput(encodeURIComponent(input));
			toast.success("URL encoded successfully!");
		} catch (err: any) {
			toast.error(`Encoding failed: ${err.message}`);
		}
	};

	const handleDecode = () => {
		try {
			setOutput(decodeURIComponent(input));
			toast.success("URL decoded successfully!");
		} catch (err: any) {
			toast.error(`Decoding failed: Invalid URI characters.`);
		}
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(output);
		setCopied(true);
		toast.success("Result copied to clipboard!");
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 gap-6 min-h-[350px]">
				{/* Input Panel */}
				<GlassCard className="p-4 flex flex-col space-y-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
							<LinkIcon className="h-4 w-4" />
							<span>Input Text / URL</span>
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
						className="w-full min-h-[120px] p-4 bg-muted/40 border border-border/40 rounded-2xl font-mono text-sm leading-relaxed text-foreground focus:outline-none focus:ring-1 focus:ring-primary/20"
						placeholder="Paste text or URL here..."
					/>
					<div className="flex gap-2 pt-2">
						<Button onClick={handleEncode} className="flex-1 font-semibold">
							URL Encode
						</Button>
						<Button onClick={handleDecode} variant="outline" className="flex-1 font-semibold">
							URL Decode
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
						placeholder="Output will appear here..."
					/>
				</GlassCard>
			</div>
		</div>
	);
}
