"use client";

import React, { useState, useEffect } from "react";
import { 
	SearchIcon, 
	InfoIcon, 
	MonitorIcon, 
	TerminalIcon, 
	ShieldIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "../shared/WorkspaceComponents";

export default function UserAgentParserTool() {
	const [uaInput, setUaInput] = useState("");
	const [parsedData, setParsedData] = useState<any>(null);

	const parseUA = (uaStr: string) => {
		if (!uaStr) return;

		let browser = "Unknown Browser";
		let os = "Unknown OS";
		let engine = "Unknown Engine";

		// Simple local parsing regex matching popular agents
		if (/chrome|crios/i.test(uaStr) && !/edge|edg/i.test(uaStr) && !/opr/i.test(uaStr)) {
			browser = "Google Chrome";
		} else if (/safari/i.test(uaStr) && !/chrome|crios/i.test(uaStr)) {
			browser = "Apple Safari";
		} else if (/firefox|fxios/i.test(uaStr)) {
			browser = "Mozilla Firefox";
		} else if (/edge|edg/i.test(uaStr)) {
			browser = "Microsoft Edge";
		} else if (/opr/i.test(uaStr)) {
			browser = "Opera";
		}

		if (/windows/i.test(uaStr)) {
			os = "Windows";
		} else if (/macintosh|mac os x/i.test(uaStr)) {
			os = "macOS";
		} else if (/iphone|ipad|ipod/i.test(uaStr)) {
			os = "iOS";
		} else if (/android/i.test(uaStr)) {
			os = "Android";
		} else if (/linux/i.test(uaStr)) {
			os = "Linux";
		}

		if (/webkit/i.test(uaStr)) {
			engine = "WebKit (Blink)";
		} else if (/gecko/i.test(uaStr)) {
			engine = "Gecko";
		} else if (/trident/i.test(uaStr)) {
			engine = "Trident";
		}

		setParsedData({
			userAgent: uaStr,
			browser,
			os,
			engine
		});
	};

	useEffect(() => {
		if (typeof window !== "undefined") {
			const currentUA = window.navigator.userAgent;
			setUaInput(currentUA);
			parseUA(currentUA);
		}
	}, []);

	return (
		<div className="space-y-6">
			{/* Current Client Info */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<GlassCard className="p-4 flex items-center gap-3">
					<MonitorIcon className="h-5 w-5 text-primary shrink-0" />
					<div>
						<span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Detected OS</span>
						<span className="text-base font-black text-foreground">{parsedData?.os || "Detecting..."}</span>
					</div>
				</GlassCard>
				<GlassCard className="p-4 flex items-center gap-3">
					<ShieldIcon className="h-5 w-5 text-primary shrink-0" />
					<div>
						<span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Browser</span>
						<span className="text-base font-black text-foreground">{parsedData?.browser || "Detecting..."}</span>
					</div>
				</GlassCard>
				<GlassCard className="p-4 flex items-center gap-3">
					<TerminalIcon className="h-5 w-5 text-primary shrink-0" />
					<div>
						<span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Render Engine</span>
						<span className="text-base font-black text-foreground">{parsedData?.engine || "Detecting..."}</span>
					</div>
				</GlassCard>
			</div>

			{/* Interactive Parser Editor */}
			<GlassCard className="p-6 space-y-4">
				<div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
					<SearchIcon className="h-4 w-4" />
					<span>User Agent Parser Analyzer</span>
				</div>

				<div className="space-y-2">
					<label className="text-xs font-semibold text-muted-foreground">Analyze custom User Agent String:</label>
					<textarea
						value={uaInput}
						onChange={(e) => {
							setUaInput(e.target.value);
							parseUA(e.target.value);
						}}
						className="w-full min-h-[80px] p-3 bg-muted/40 border border-border/40 rounded-xl font-mono text-xs leading-relaxed text-foreground focus:outline-none focus:ring-1 focus:ring-primary/20"
						placeholder="Paste user agent string here..."
					/>
				</div>

				{parsedData && (
					<div className="border border-border/20 rounded-2xl overflow-hidden divide-y divide-border/10 bg-card/10 text-xs md:text-sm">
						<div className="p-4 flex justify-between gap-4">
							<span className="font-semibold text-muted-foreground">Raw Agent</span>
							<span className="text-right text-foreground font-mono break-all max-w-xl">{parsedData.userAgent}</span>
						</div>
						<div className="p-4 flex justify-between">
							<span className="font-semibold text-muted-foreground">Browser Family</span>
							<span className="text-right text-primary font-bold">{parsedData.browser}</span>
						</div>
						<div className="p-4 flex justify-between">
							<span className="font-semibold text-muted-foreground">OS Platform</span>
							<span className="text-right text-foreground font-semibold">{parsedData.os}</span>
						</div>
						<div className="p-4 flex justify-between">
							<span className="font-semibold text-muted-foreground">Layout Engine</span>
							<span className="text-right text-foreground">{parsedData.engine}</span>
						</div>
					</div>
				)}
			</GlassCard>
		</div>
	);
}
