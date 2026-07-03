"use client";

import React, { useState, useEffect } from "react";
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

export default function TextToBinaryHexOctalTool() {
	const [input, setInput] = useState("SopKit");
	const [binary, setBinary] = useState("");
	const [hex, setHex] = useState("");
	const [octal, setOctal] = useState("");
	const [copiedType, setCopiedType] = useState("");

	const convertText = (str: string) => {
		if (!str) {
			setBinary("");
			setHex("");
			setOctal("");
			return;
		}

		let binArray: string[] = [];
		let hexArray: string[] = [];
		let octArray: string[] = [];

		for (let i = 0; i < str.length; i++) {
			const charCode = str.charCodeAt(i);
			binArray.push(charCode.toString(2).padStart(8, "0"));
			hexArray.push(charCode.toString(16).toUpperCase().padStart(2, "0"));
			octArray.push(charCode.toString(8).padStart(3, "0"));
		}

		setBinary(binArray.join(" "));
		setHex(hexArray.join(" "));
		setOctal(octArray.join(" "));
	};

	useEffect(() => {
		convertText(input);
	}, [input]);

	const copyToClipboard = (content: string, type: string) => {
		if (!content) return;
		navigator.clipboard.writeText(content);
		setCopiedType(type);
		toast.success(`${type.toUpperCase()} string copied!`);
		setTimeout(() => setCopiedType(""), 2000);
	};

	return (
		<div className="space-y-6">
			{/* Input Panel */}
			<GlassCard className="p-4 flex flex-col space-y-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
						<CodeIcon className="h-4 w-4" />
						<span>String Input</span>
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
					className="w-full min-h-[80px] p-4 bg-muted/40 border border-border/40 rounded-2xl font-mono text-sm leading-relaxed text-foreground focus:outline-none"
					placeholder="Enter your string text here..."
				/>
			</GlassCard>

			{/* Outputs */}
			<div className="space-y-4">
				{/* Binary */}
				<GlassCard className="p-4 space-y-2">
					<div className="flex justify-between items-center text-xs">
						<span className="font-bold text-muted-foreground uppercase">Binary Format</span>
						<Button 
							size="sm" 
							variant="ghost" 
							onClick={() => copyToClipboard(binary, "binary")} 
							disabled={!binary}
							className="h-7 gap-1"
						>
							{copiedType === "binary" ? <CheckCircleIcon className="h-3.5 w-3.5 text-green-500" /> : <CopyIcon className="h-3.5 w-3.5" />}
							Copy Binary
						</Button>
					</div>
					<textarea 
						readOnly
						value={binary}
						className="w-full h-16 p-3 bg-muted/20 border border-border/20 rounded-xl font-mono text-xs resize-none text-foreground focus:outline-none"
					/>
				</GlassCard>

				{/* Hexadecimal */}
				<GlassCard className="p-4 space-y-2">
					<div className="flex justify-between items-center text-xs">
						<span className="font-bold text-muted-foreground uppercase">Hexadecimal Format</span>
						<Button 
							size="sm" 
							variant="ghost" 
							onClick={() => copyToClipboard(hex, "hex")} 
							disabled={!hex}
							className="h-7 gap-1"
						>
							{copiedType === "hex" ? <CheckCircleIcon className="h-3.5 w-3.5 text-green-500" /> : <CopyIcon className="h-3.5 w-3.5" />}
							Copy Hex
						</Button>
					</div>
					<textarea 
						readOnly
						value={hex}
						className="w-full h-16 p-3 bg-muted/20 border border-border/20 rounded-xl font-mono text-xs resize-none text-foreground focus:outline-none"
					/>
				</GlassCard>

				{/* Octal */}
				<GlassCard className="p-4 space-y-2">
					<div className="flex justify-between items-center text-xs">
						<span className="font-bold text-muted-foreground uppercase">Octal Format</span>
						<Button 
							size="sm" 
							variant="ghost" 
							onClick={() => copyToClipboard(octal, "octal")} 
							disabled={!octal}
							className="h-7 gap-1"
						>
							{copiedType === "octal" ? <CheckCircleIcon className="h-3.5 w-3.5 text-green-500" /> : <CopyIcon className="h-3.5 w-3.5" />}
							Copy Octal
						</Button>
					</div>
					<textarea 
						readOnly
						value={octal}
						className="w-full h-16 p-3 bg-muted/20 border border-border/20 rounded-xl font-mono text-xs resize-none text-foreground focus:outline-none"
					/>
				</GlassCard>
			</div>
		</div>
	);
}
