"use client";

import React, { useState, useEffect } from "react";
import { 
	CodeIcon, 
	CopyIcon, 
	CheckCircleIcon,
	TrashIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "../shared/WorkspaceComponents";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function HtmlEntityCodecTool() {
	const [inputText, setInputText] = useState("<h1>Hello World! & Welcome to 'SopKit' & \"Antigravity\"</h1>");
	const [outputText, setOutputText] = useState("");
	const [activeMode, setActiveMode] = useState("encode"); // encode, decode
	const [copied, setCopied] = useState(false);

	const encodeHtml = (str) => {
		return str.replace(/[\u00A0-\u9999<>&"']/g, (i) => `&#${i.charCodeAt(0)};`);
	};

	const decodeHtml = (str) => {
		const temp = document.createElement("textarea");
		temp.innerHTML = str;
		return temp.value;
	};

	const processText = () => {
		if (!inputText.trim()) {
			setOutputText("");
			return;
		}

		if (activeMode === "encode") {
			setOutputText(encodeHtml(inputText));
		} else {
			setOutputText(decodeHtml(inputText));
		}
	};

	useEffect(() => {
		processText();
	}, [inputText, activeMode]);

	const copyToClipboard = () => {
		if (!outputText) return;
		navigator.clipboard.writeText(outputText);
		setCopied(true);
		toast.success("Result copied!");
		setTimeout(() => setCopied(false), 2000);
	};

	const clearAll = () => {
		setInputText("");
		setOutputText("");
	};

	return (
		<div className="w-full max-w-5xl mx-auto space-y-12 pb-24 animate-in">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
				{/* Input */}
				<div className="lg:col-span-6 space-y-8">
					<GlassCard className="p-8">
						<div className="flex justify-between items-center mb-6">
							<span className="font-bold text-2xl flex items-center gap-2">
								<CodeIcon className="text-primary w-6 h-6" />
								Configuration
							</span>
							{inputText && (
								<Button variant="ghost" size="sm" onClick={clearAll} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
									<TrashIcon className="h-4 w-4 mr-2" />
									Clear
								</Button>
							)}
						</div>

						<div className="space-y-6">
							<div>
								<label className="block text-sm font-bold mb-2">Select Action</label>
								<Tabs defaultValue="encode" className="w-full" onValueChange={setActiveMode}>
									<TabsList className="grid w-full grid-cols-2 bg-muted/40 p-1 rounded-xl border border-border/40 h-12">
										<TabsTrigger value="encode" className="rounded-lg font-bold">Encode Entities</TabsTrigger>
										<TabsTrigger value="decode" className="rounded-lg font-bold">Decode Entities</TabsTrigger>
									</TabsList>
								</Tabs>
							</div>

							<div className="space-y-2">
								<label className="block text-sm font-bold">Input String</label>
								<textarea
									value={inputText}
									onChange={(e) => setInputText(e.target.value)}
									placeholder={activeMode === "encode" ? "Type raw text to encode (e.g. <h1>)..." : "Paste encoded HTML (e.g. &lt;h1&gt;)..."}
									className="w-full h-44 bg-muted/20 border border-border/40 rounded-2xl p-4 font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none custom-scrollbar"
								/>
							</div>
						</div>
					</GlassCard>
				</div>

				{/* Output */}
				<div className="lg:col-span-6 space-y-8">
					<GlassCard className="p-8 flex flex-col h-full">
						<span className="font-bold text-2xl mb-6">Result</span>

						<div className="flex-1 min-h-48 bg-muted/10 border border-border/40 rounded-2xl p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap overflow-y-auto max-h-72 custom-scrollbar select-all">
							{outputText || <span className="text-muted-foreground text-sm italic">Result will appear here...</span>}
						</div>

						<div className="mt-6 flex justify-end">
							<Button
								onClick={copyToClipboard}
								disabled={!outputText}
								className="h-14 px-8 rounded-2xl font-bold bg-primary hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center gap-2 w-full sm:w-auto"
							>
								{copied ? (
									<>
										<CheckCircleIcon className="w-5 h-5" />
										COPIED!
									</>
								) : (
									<>
										<CopyIcon className="w-5 h-5" />
										COPY RESULT
									</>
								)}
							</Button>
						</div>
					</GlassCard>
				</div>
			</div>
		</div>
	);
}
