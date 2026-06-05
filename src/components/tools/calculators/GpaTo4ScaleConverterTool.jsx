"use client";

import React, { useState, useEffect } from "react";
import { 
	GraduationCapIcon, 
	CopyIcon, 
	CheckCircleIcon,
	TrendingUpIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "../shared/WorkspaceComponents";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function GpaTo4ScaleConverterTool() {
	const [inputType, setInputType] = useState("cgpa"); // cgpa, percentage
	const [inputValue, setInputValue] = useState("8.5");
	const [result, setResult] = useState(null);
	const [copied, setCopied] = useState(false);

	const convertGpa = () => {
		const val = parseFloat(inputValue);
		if (isNaN(val) || val < 0) {
			setResult(null);
			return;
		}

		let gpa = 0.0;
		let grade = "F";

		if (inputType === "cgpa") {
			const safeVal = Math.min(10, val);
			// Standard 10-point scale to 4.0 scale
			if (safeVal >= 9.0) {
				gpa = 4.0;
				grade = "A";
			} else if (safeVal >= 8.0) {
				gpa = 3.5 + ((safeVal - 8.0) * 0.5); // 3.5 to 3.99
				grade = "A-";
			} else if (safeVal >= 7.0) {
				gpa = 3.0 + ((safeVal - 7.0) * 0.5); // 3.0 to 3.49
				grade = "B";
			} else if (safeVal >= 6.0) {
				gpa = 2.0 + ((safeVal - 6.0) * 1.0); // 2.0 to 2.99
				grade = "C";
			} else {
				gpa = (safeVal / 10) * 4;
				grade = "D";
			}
		} else {
			const safeVal = Math.min(100, val);
			// Percentage scale to 4.0 scale
			if (safeVal >= 90) {
				gpa = 4.0;
				grade = "A";
			} else if (safeVal >= 80) {
				gpa = 3.7 + ((safeVal - 80) * 0.03); // 3.7 to 3.99
				grade = "A-";
			} else if (safeVal >= 70) {
				gpa = 3.0 + ((safeVal - 70) * 0.07); // 3.0 to 3.69
				grade = "B";
			} else if (safeVal >= 60) {
				gpa = 2.0 + ((safeVal - 60) * 0.1); // 2.0 to 2.9
				grade = "C";
			} else {
				gpa = Math.max(0, (safeVal / 100) * 4);
				grade = "F";
			}
		}

		setResult({
			gpa: parseFloat(gpa.toFixed(2)),
			grade,
			original: val,
			type: inputType === "cgpa" ? "CGPA" : "Percentage"
		});
	};

	useEffect(() => {
		convertGpa();
	}, [inputType, inputValue]);

	const copyResult = () => {
		if (!result) return;
		const summary = `GPA Converter Result:\n- Input: ${result.original} (${result.type})\n- US 4.0 Scale GPA: ${result.gpa} (Grade: ${result.grade})`;
		navigator.clipboard.writeText(summary);
		setCopied(true);
		toast.success("GPA result copied!");
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="w-full max-w-5xl mx-auto space-y-12 pb-24 animate-in">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
				{/* Settings */}
				<div className="lg:col-span-6 space-y-8">
					<GlassCard className="p-8 space-y-6">
						<h3 className="text-2xl font-bold flex items-center gap-2 mb-4">
							<GraduationCapIcon className="text-primary w-6 h-6" />
							Score Details
						</h3>

						<div className="space-y-6">
							<div className="space-y-2">
								<label className="text-sm font-bold">Input Score Type</label>
								<Select value={inputType} onValueChange={(val) => { setInputType(val); setInputValue(val === "cgpa" ? "8.5" : "85"); }}>
									<SelectTrigger className="h-12 rounded-xl bg-muted/20 font-bold border-border/40">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="rounded-xl border-border/40">
										<SelectItem value="cgpa" className="rounded-lg">CGPA (10-Point scale)</SelectItem>
										<SelectItem value="percentage" className="rounded-lg">Percentage (%)</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-bold">
									{inputType === "cgpa" ? "Enter your CGPA (e.g. 0 to 10.0)" : "Enter your Percentage (e.g. 0 to 100)"}
								</label>
								<input
									type="number"
									step={inputType === "cgpa" ? "0.1" : "1"}
									min="0"
									max={inputType === "cgpa" ? "10" : "100"}
									value={inputValue}
									onChange={(e) => setInputValue(e.target.value)}
									className="h-14 w-full rounded-2xl bg-muted/20 border border-border/40 px-6 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
								/>
							</div>
						</div>
					</GlassCard>
				</div>

				{/* Display Results */}
				<div className="lg:col-span-6 space-y-8">
					<GlassCard className="p-8 flex flex-col h-full justify-between">
						<div className="space-y-6">
							<div className="flex justify-between items-center">
								<span className="font-bold text-2xl">GPA Scorecard</span>
								<TrendingUpIcon className="text-primary w-6 h-6 animate-pulse" />
							</div>

							{result && (
								<div className="space-y-6">
									<div className="grid grid-cols-2 gap-4">
										<div className="p-6 bg-primary/10 border border-primary/20 rounded-3xl text-center">
											<div className="text-5xl font-black text-primary font-mono">{result.gpa}</div>
											<div className="text-sm text-muted-foreground font-bold mt-2">US 4.0 Scale GPA</div>
										</div>

										<div className="p-6 bg-muted/15 border border-border/40 rounded-3xl text-center flex flex-col items-center justify-center">
											<Badge className="text-2xl px-5 py-1 text-center font-black bg-primary text-primary-foreground select-none">
												{result.grade}
											</Badge>
											<div className="text-sm text-muted-foreground font-bold mt-3">Estimated Grade</div>
										</div>
									</div>

									<div className="border-t border-border/40 pt-6 text-sm text-muted-foreground leading-relaxed">
										<p>
											This represents an estimated conversion standard suitable for university reference, WES mapping, and study abroad planning. Always check with your specific application guidelines for official conversions.
										</p>
									</div>
								</div>
							)}
						</div>

						<div className="mt-8">
							<Button
								onClick={copyResult}
								disabled={!result}
								className="w-full h-16 rounded-[1.5rem] font-bold bg-primary hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
							>
								{copied ? (
									<>
										<CheckCircleIcon className="w-5 h-5" />
										COPIED RESULTS!
									</>
								) : (
									<>
										<CopyIcon className="w-5 h-5" />
										COPY GPA SCORE
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
