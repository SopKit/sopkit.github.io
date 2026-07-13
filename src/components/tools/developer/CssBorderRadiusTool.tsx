"use client";

import React, { useState } from "react";
import { 
	LayoutIcon, 
	CopyIcon, 
	CheckCircleIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "../shared/WorkspaceComponents";
import { toast } from "sonner";

export default function CssBorderRadiusTool() {
	const [topLeft, setTopLeft] = useState(12);
	const [topRight, setTopRight] = useState(12);
	const [bottomRight, setBottomRight] = useState(12);
	const [bottomLeft, setBottomLeft] = useState(12);
	const [unit, setUnit] = useState("px");
	const [copied, setCopied] = useState(false);

	const getBorderRadiusValue = () => {
		return `${topLeft}${unit} ${topRight}${unit} ${bottomRight}${unit} ${bottomLeft}${unit}`;
	};

	const getCssCode = () => {
		return `border-radius: ${getBorderRadiusValue()};
-webkit-border-radius: ${getBorderRadiusValue()};
-moz-border-radius: ${getBorderRadiusValue()};`;
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(getCssCode());
		setCopied(true);
		toast.success("CSS code copied to clipboard!");
		setTimeout(() => setCopied(false), 2000);
	};

	const resetValues = () => {
		setTopLeft(12);
		setTopRight(12);
		setBottomRight(12);
		setBottomLeft(12);
	};

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px]">
				{/* Controls */}
				<GlassCard className="p-6 space-y-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
							<LayoutIcon className="h-4 w-4" />
							<span>Border Radius Settings</span>
						</div>
						<div className="flex gap-2">
							<Button variant="outline" size="sm" onClick={() => setUnit(unit === "px" ? "%" : "px")}>
								Unit: {unit}
							</Button>
							<Button variant="ghost" size="sm" onClick={resetValues} className="text-muted-foreground hover:text-destructive">
								Reset
							</Button>
						</div>
					</div>

					<div className="space-y-4 text-xs md:text-sm">
						{/* Top Left */}
						<div className="space-y-2">
							<div className="flex justify-between font-semibold">
								<span>Top Left Corner</span>
								<span>{topLeft}{unit}</span>
							</div>
							<input
								type="range"
								min="0"
								max={unit === "px" ? "150" : "50"}
								value={topLeft}
								onChange={(e) => setTopLeft(Number(e.target.value))}
								className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
							/>
						</div>

						{/* Top Right */}
						<div className="space-y-2">
							<div className="flex justify-between font-semibold">
								<span>Top Right Corner</span>
								<span>{topRight}{unit}</span>
							</div>
							<input
								type="range"
								min="0"
								max={unit === "px" ? "150" : "50"}
								value={topRight}
								onChange={(e) => setTopRight(Number(e.target.value))}
								className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
							/>
						</div>

						{/* Bottom Right */}
						<div className="space-y-2">
							<div className="flex justify-between font-semibold">
								<span>Bottom Right Corner</span>
								<span>{bottomRight}{unit}</span>
							</div>
							<input
								type="range"
								min="0"
								max={unit === "px" ? "150" : "50"}
								value={bottomRight}
								onChange={(e) => setBottomRight(Number(e.target.value))}
								className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
							/>
						</div>

						{/* Bottom Left */}
						<div className="space-y-2">
							<div className="flex justify-between font-semibold">
								<span>Bottom Left Corner</span>
								<span>{bottomLeft}{unit}</span>
							</div>
							<input
								type="range"
								min="0"
								max={unit === "px" ? "150" : "50"}
								value={bottomLeft}
								onChange={(e) => setBottomLeft(Number(e.target.value))}
								className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
							/>
						</div>
					</div>
				</GlassCard>

				{/* Preview & Code */}
				<GlassCard className="p-6 flex flex-col justify-between space-y-6">
					{/* Box Live Preview */}
					<div className="flex-grow flex items-center justify-center min-h-[200px]">
						<div 
							style={{ 
								borderRadius: getBorderRadiusValue(),
								width: "160px",
								height: "160px"
							}} 
							className="bg-primary/10 border-2 border-primary shadow-[0_10px_30px_rgba(59,130,246,0.1)] transition-all duration-100 flex items-center justify-center text-center text-xs font-bold text-primary p-2"
						>
							Live Preview
						</div>
					</div>

					{/* Compiled CSS */}
					<div className="space-y-2">
						<div className="flex justify-between items-center text-xs">
							<span className="font-bold text-muted-foreground uppercase">CSS Code</span>
							<Button 
								size="sm" 
								onClick={copyToClipboard}
								className="gap-1"
							>
								{copied ? <CheckCircleIcon className="h-3.5 w-3.5 text-green-400" /> : <CopyIcon className="h-3.5 w-3.5" />}
								Copy Rules
							</Button>
						</div>
						<pre className="p-3 bg-muted/40 border border-border/40 rounded-xl font-mono text-xs text-foreground overflow-x-auto select-all">
							{getCssCode()}
						</pre>
					</div>
				</GlassCard>
			</div>
		</div>
	);
}
