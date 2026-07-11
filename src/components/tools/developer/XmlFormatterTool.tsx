"use client";

import React, { useState, useEffect } from "react";
import { 
	CodeIcon, 
	CopyIcon, 
	CheckCircleIcon,
	TrashIcon,
	BracesIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "../shared/WorkspaceComponents";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { validate, format, minify } from "@sopkit/xml";

export default function XmlFormatterTool() {
	const [xmlInput, setXmlInput] = useState(`<?xml version="1.0" encoding="UTF-8"?>
<store>
<book id="1"><title>The Hobbit</title><author>J.R.R. Tolkien</author><price>14.99</price></book>
<book id="2"><title>Dune</title><author>Frank Herbert</author><price>12.99</price></book>
</store>`);

	const [xmlOutput, setXmlOutput] = useState("");
	const [copied, setCopied] = useState(false);
	const [error, setError] = useState("");
	const [activeTab, setActiveTab] = useState("beautify"); // beautify, minify

	const formatXmlStr = (xml, mode) => {
		if (!xml.trim()) {
			setXmlOutput("");
			setError("");
			return;
		}

		try {
			// Validate using @sopkit/xml
			const validation = validate(xml);
			if (!validation.valid) {
				setError(validation.error || "Invalid XML string");
				setXmlOutput("");
				return;
			}
			setError("");

			if (mode === "minify") {
				const minified = minify(xml);
				setXmlOutput(minified);
			} else {
				const formatted = format(xml, 2);
				setXmlOutput(formatted);
			}
		} catch (err: any) {
			setError(err.message);
			setXmlOutput("");
		}
	};

	useEffect(() => {
		formatXmlStr(xmlInput, activeTab);
	}, [xmlInput, activeTab]);

	const copyToClipboard = () => {
		if (!xmlOutput) return;
		navigator.clipboard.writeText(xmlOutput);
		setCopied(true);
		toast.success("XML code copied!");
		setTimeout(() => setCopied(false), 2000);
	};

	const clearAll = () => {
		setXmlInput("");
		setXmlOutput("");
		setError("");
	};

	return (
		<div className="w-full max-w-6xl mx-auto space-y-8 pb-24 animate-in">
			<div className="flex justify-between items-center px-4">
				<h3 className="text-lg font-bold flex items-center gap-2 text-muted-foreground">
					<CodeIcon className="w-5 h-5 text-primary" />
					XML Formatter & Beautifier
				</h3>
				<Button variant="ghost" size="sm" onClick={clearAll} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
					<TrashIcon className="h-4 w-4 mr-2" />
					Clear
				</Button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* XML Input */}
				<GlassCard className="p-6 flex flex-col">
					<div className="flex justify-between items-center mb-4">
						<span className="font-bold text-lg">XML Input</span>
						<Badge variant="secondary">Raw XML</Badge>
					</div>
					<textarea
						value={xmlInput}
						onChange={(e) => setXmlInput(e.target.value)}
						placeholder="Paste your XML code here..."
						className="w-full h-[500px] bg-muted/20 border border-border/40 rounded-2xl p-6 font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/20 custom-scrollbar resize-none"
					/>
					{error && (
						<div className="mt-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono max-h-24 overflow-y-auto">
							Invalid XML Structure: {error}
						</div>
					)}
				</GlassCard>

				{/* XML Output */}
				<GlassCard className="p-6 flex flex-col">
					<div className="flex justify-between items-center mb-4">
						<span className="font-bold text-lg">Formatted Result</span>
						<Tabs defaultValue="beautify" className="w-40" onValueChange={setActiveTab}>
							<TabsList className="grid w-full grid-cols-2 bg-muted/40 p-1 rounded-xl border border-border/40 h-10">
								<TabsTrigger value="beautify" className="rounded-lg text-xs font-bold">Beautify</TabsTrigger>
								<TabsTrigger value="minify" className="rounded-lg text-xs font-bold">Minify</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>

					<div className="flex-1 min-h-[440px] max-h-[500px] overflow-y-auto bg-muted/10 border border-border/40 rounded-2xl p-6 custom-scrollbar">
						{xmlOutput ? (
							<pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap select-all text-primary-foreground/90">
								<code>{xmlOutput}</code>
							</pre>
						) : (
							<span className="text-muted-foreground text-sm italic">Valid XML output will appear here...</span>
						)}
					</div>

					<div className="mt-6 flex justify-end">
						<Button
							onClick={copyToClipboard}
							disabled={!xmlOutput}
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
									COPY XML
								</>
							)}
						</Button>
					</div>
				</GlassCard>
			</div>
		</div>
	);
}
