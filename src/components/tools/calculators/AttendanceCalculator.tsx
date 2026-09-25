"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
	Calculator,
	Check,
	AlertCircle,
	HelpCircle,
	RefreshCw,
	Copy,
	Plus,
	Trash2,
	TrendingUp,
	TrendingDown,
	GraduationCap,
	BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
	ToolShell,
	ToolGrid,
	ToolGridMain,
	ToolGridSide,
	ToolPanel,
	ToolSectionTitle,
	ToolField,
	ToolModeTabs,
	ToolPrivacyNote,
} from "@/components/tools/shared/design-system";

interface SubjectItem {
	id: string;
	name: string;
	attended: number;
	total: number;
}

const DEFAULT_SUBJECTS: SubjectItem[] = [
	{ id: "1", name: "Data Structures & Algorithms", attended: 28, total: 34 },
	{ id: "2", name: "Database Management Systems", attended: 22, total: 32 },
	{ id: "3", name: "Computer Networks", attended: 25, total: 30 },
	{ id: "4", name: "Mathematics & Statistics", attended: 31, total: 36 },
];

export default function AttendanceCalculator() {
	const [mode, setMode] = useState<"quick" | "roster">("quick");

	// Quick calculator state
	const [attended, setAttended] = useState("32");
	const [total, setTotal] = useState("42");
	const [target, setTarget] = useState("75");
	const [futureClasses, setFutureClasses] = useState<number>(0);
	const [copied, setCopied] = useState(false);

	// Multi-subject state
	const [subjects, setSubjects] = useState<SubjectItem[]>(() => {
		if (typeof window !== "undefined") {
			try {
				const saved = localStorage.getItem("sopkit_attendance_subjects");
				if (saved) return JSON.parse(saved);
			} catch {
				// fallback
			}
		}
		return DEFAULT_SUBJECTS;
	});

	useEffect(() => {
		if (typeof window !== "undefined") {
			try {
				localStorage.setItem("sopkit_attendance_subjects", JSON.stringify(subjects));
			} catch {
				// ignore
			}
		}
	}, [subjects]);

	const attNum = Math.max(0, parseInt(attended, 10) || 0);
	const totNum = Math.max(0, parseInt(total, 10) || 0);
	const targetPct = Math.min(100, Math.max(1, parseFloat(target) || 75));

	// Primary computation
	const analysis = useMemo(() => {
		if (totNum <= 0) return null;
		if (attNum > totNum) return { error: "Attended classes cannot exceed total classes conducted." };

		const currentPct = (attNum / totNum) * 100;
		const missed = totNum - attNum;

		// Simulated projection
		const simulatedAtt = attNum + futureClasses;
		const simulatedTot = totNum + futureClasses;
		const projectedPct = (simulatedAtt / simulatedTot) * 100;

		if (currentPct >= targetPct) {
			// Classes user can safely bunk
			// (attNum) / (totNum + x) >= targetPct / 100
			// attNum * 100 >= targetPct * totNum + targetPct * x
			// x <= (attNum * 100 - targetPct * totNum) / targetPct
			const safeBunks = Math.floor((attNum * 100 - targetPct * totNum) / targetPct);

			return {
				status: "safe" as const,
				currentPct,
				missed,
				safeBunks: Math.max(0, safeBunks),
				classesNeeded: 0,
				projectedPct,
			};
		} else {
			// Classes user must attend consecutively
			// (attNum + x) / (totNum + x) >= targetPct / 100
			// (attNum + x) * 100 >= targetPct * (totNum + x)
			// x * (100 - targetPct) >= targetPct * totNum - 100 * attNum
			// x >= (targetPct * totNum - 100 * attNum) / (100 - targetPct)
			if (targetPct >= 100) {
				return {
					status: "shortage" as const,
					currentPct,
					missed,
					safeBunks: 0,
					classesNeeded: Infinity,
					impossible: true,
					projectedPct,
				};
			}

			const classesNeeded = Math.ceil((targetPct * totNum - 100 * attNum) / (100 - targetPct));

			return {
				status: "shortage" as const,
				currentPct,
				missed,
				safeBunks: 0,
				classesNeeded: Math.max(1, classesNeeded),
				impossible: false,
				projectedPct,
			};
		}
	}, [attNum, totNum, targetPct, futureClasses]);

	// Multi-subject aggregate calculations
	const rosterSummary = useMemo(() => {
		const totalAtt = subjects.reduce((sum, s) => sum + s.attended, 0);
		const totalCond = subjects.reduce((sum, s) => sum + s.total, 0);
		const overallPct = totalCond > 0 ? (totalAtt / totalCond) * 100 : 0;
		const lowSubjects = subjects.filter((s) => s.total > 0 && (s.attended / s.total) * 100 < targetPct);

		return {
			totalAtt,
			totalCond,
			overallPct,
			lowCount: lowSubjects.length,
		};
	}, [subjects, targetPct]);

	const handleAddSubject = () => {
		const newSub: SubjectItem = {
			id: Date.now().toString(),
			name: `Subject ${subjects.length + 1}`,
			attended: 20,
			total: 25,
		};
		setSubjects([...subjects, newSub]);
	};

	const handleUpdateSubject = (id: string, field: keyof SubjectItem, val: string | number) => {
		setSubjects(
			subjects.map((s) => {
				if (s.id !== id) return s;
				return { ...s, [field]: val };
			})
		);
	};

	const handleDeleteSubject = (id: string) => {
		if (subjects.length <= 1) return;
		setSubjects(subjects.filter((s) => s.id !== id));
	};

	const handleCopyReport = () => {
		if (!analysis || "error" in analysis) return;
		const text = `Attendance Report:
• Current Percentage: ${analysis.currentPct.toFixed(2)}% (${attNum}/${totNum} classes)
• Target Threshold: ${targetPct}%
• Status: ${analysis.status === "safe" ? `Compliant — Can safely miss ${analysis.safeBunks} class(es)` : `Shortage — Need to attend ${analysis.classesNeeded} consecutive class(es)`}
• Classes Missed So Far: ${analysis.missed}
Calculated privately with SopKit (https://sopkit.space/attendance-shortage-calculator)`;

		navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<ToolShell>
			<ToolModeTabs
				value={mode}
				onValueChange={(v) => setMode(v as "quick" | "roster")}
				tabs={[
					{ value: "quick", label: "Quick Calculator & Bunk Planner" },
					{ value: "roster", label: "Semester Multi-Course Tracker" },
				]}
			/>

			{mode === "quick" ? (
				<ToolGrid>
					<ToolGridMain className="space-y-6">
						<ToolPanel className="space-y-5">
							<ToolSectionTitle
								icon={<Calculator className="h-4 w-4 text-primary" />}
								title="Class Record Inputs"
								subtitle="Enter your attended and total classes to calculate eligibility"
							/>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<ToolField label="Classes Attended" fieldId="att-input">
									<Input
										id="att-input"
										type="number"
										min="0"
										value={attended}
										onChange={(e) => setAttended(e.target.value)}
										className="h-10 text-base"
									/>
								</ToolField>

								<ToolField label="Total Classes Conducted" fieldId="tot-input">
									<Input
										id="tot-input"
										type="number"
										min="0"
										value={total}
										onChange={(e) => setTotal(e.target.value)}
										className="h-10 text-base"
									/>
								</ToolField>
							</div>

							<div className="space-y-2">
								<ToolField label="Target Attendance Requirement (%)" fieldId="target-input">
									<Input
										id="target-input"
										type="number"
										min="1"
										max="100"
										value={target}
										onChange={(e) => setTarget(e.target.value)}
										className="h-10 text-base"
									/>
								</ToolField>

								<div className="flex items-center gap-2 pt-1">
									<span className="text-xs text-muted-foreground">Standard Targets:</span>
									<Button
										type="button"
										variant="outline"
										size="sm"
										className={`h-6 text-xs px-2.5 rounded-full ${target === "75" ? "border-primary bg-primary/10 text-primary font-semibold" : ""}`}
										onClick={() => setTarget("75")}
									>
										75% (UGC/Standard)
									</Button>
									<Button
										type="button"
										variant="outline"
										size="sm"
										className={`h-6 text-xs px-2.5 rounded-full ${target === "80" ? "border-primary bg-primary/10 text-primary font-semibold" : ""}`}
										onClick={() => setTarget("80")}
									>
										80%
									</Button>
									<Button
										type="button"
										variant="outline"
										size="sm"
										className={`h-6 text-xs px-2.5 rounded-full ${target === "85" ? "border-primary bg-primary/10 text-primary font-semibold" : ""}`}
										onClick={() => setTarget("85")}
									>
										85% (Strict)
									</Button>
								</div>
							</div>
						</ToolPanel>

						{/* Result & Recommendation Card */}
						{analysis && !("error" in analysis) && (
							<ToolPanel className={`space-y-6 border-2 ${
								analysis.status === "safe"
									? "border-emerald-500/30 bg-emerald-500/[0.03]"
									: "border-rose-500/30 bg-rose-500/[0.03]"
							}`}>
								<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-4">
									<ToolSectionTitle
										icon={analysis.status === "safe" ? <Check className="h-4 w-4 text-emerald-500" /> : <AlertCircle className="h-4 w-4 text-rose-500" />}
										title="Attendance Status & Bunk Plan"
										subtitle={`Target: ${targetPct}% requirement`}
									/>
									<Button
										size="sm"
										variant="secondary"
										className="h-8 gap-1.5 text-xs rounded-xl self-start sm:self-auto"
										onClick={handleCopyReport}
									>
										{copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
										<span>{copied ? "Copied Report" : "Copy Report"}</span>
									</Button>
								</div>

								{/* Primary Metric Hero */}
								<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
									<div className="p-4 rounded-xl bg-surface-muted/60 dark:bg-muted/30 border border-border">
										<div className={`text-4xl font-mono font-bold ${
											analysis.status === "safe" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
										}`}>
											{analysis.currentPct.toFixed(1)}%
										</div>
										<div className="text-xs font-medium text-muted-foreground mt-1">Current Attendance</div>
									</div>

									<div className="p-4 rounded-xl bg-surface-muted/60 dark:bg-muted/30 border border-border">
										<div className="text-4xl font-mono font-bold text-foreground">
											{analysis.status === "safe" ? analysis.safeBunks : 0}
										</div>
										<div className="text-xs font-medium text-muted-foreground mt-1">Safe Bunks Left</div>
									</div>

									<div className="p-4 rounded-xl bg-surface-muted/60 dark:bg-muted/30 border border-border">
										<div className="text-4xl font-mono font-bold text-foreground">
											{analysis.status === "safe" ? 0 : analysis.classesNeeded}
										</div>
										<div className="text-xs font-medium text-muted-foreground mt-1">Classes Needed</div>
									</div>
								</div>

								{/* Guidance Banner */}
								<div className={`p-4 rounded-xl border flex items-start gap-3 ${
									analysis.status === "safe"
										? "bg-emerald-500/10 border-emerald-500/20 text-foreground"
										: "bg-rose-500/10 border-rose-500/20 text-foreground"
								}`}>
									{analysis.status === "safe" ? (
										<Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
									) : (
										<AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
									)}
									<div className="space-y-1 text-sm leading-relaxed">
										{analysis.status === "safe" ? (
											analysis.safeBunks > 0 ? (
												<>
													<span className="font-semibold text-emerald-600 dark:text-emerald-400">You are above target! </span>
													You can safely miss the next <strong>{analysis.safeBunks}</strong> class{analysis.safeBunks > 1 ? "es" : ""}. Your attendance will remain at or above {targetPct}%.
												</>
											) : (
												<>
													<span className="font-semibold text-amber-600 dark:text-amber-400">On the borderline! </span>
													You are currently at {analysis.currentPct.toFixed(1)}%. If you miss even 1 class, your attendance will fall below the {targetPct}% threshold.
												</>
											)
										) : (
											analysis.impossible ? (
												<>
													<span className="font-semibold text-rose-600 dark:text-rose-400">Impossible Target: </span>
													You have missed {analysis.missed} class(es). Mathematically, you can no longer achieve 100% attendance.
												</>
											) : (
												<>
													<span className="font-semibold text-rose-600 dark:text-rose-400">Attendance Shortage: </span>
													You must attend the next <strong>{analysis.classesNeeded}</strong> consecutive class{analysis.classesNeeded > 1 ? "es" : ""} without absence to restore your attendance to {targetPct}%.
												</>
											)
										)}
									</div>
								</div>

								{/* Interactive Projection Simulator */}
								<div className="p-4 rounded-xl bg-surface-muted/40 dark:bg-muted/20 border border-border space-y-3">
									<div className="flex items-center justify-between text-xs">
										<span className="font-medium text-foreground flex items-center gap-1.5">
											<TrendingUp className="h-3.5 w-3.5 text-primary" />
											Simulation: If you attend next {futureClasses} classes
										</span>
										<Badge variant="outline" className="font-mono text-xs">
											Projected: {analysis.projectedPct.toFixed(1)}%
										</Badge>
									</div>

									<Slider
										value={[futureClasses]}
										min={0}
										max={30}
										step={1}
										onValueChange={(val) => setFutureClasses(val[0])}
										className="py-1"
									/>
									<div className="flex justify-between text-[11px] text-muted-foreground">
										<span>+0 classes</span>
										<span>+15 classes</span>
										<span>+30 classes</span>
									</div>
								</div>
							</ToolPanel>
						)}

						{analysis && "error" in analysis && (
							<ToolPanel className="border-rose-500/30 bg-rose-500/5 text-center py-6">
								<p className="text-sm text-rose-600 dark:text-rose-400 font-medium">
									{analysis.error}
								</p>
							</ToolPanel>
						)}
					</ToolGridMain>

					<ToolGridSide className="space-y-6">
						<ToolPanel className="space-y-4">
							<ToolSectionTitle
								icon={<GraduationCap className="h-4 w-4 text-primary" />}
								title="Academic Rules Guide"
								subtitle="Statutory attendance norms"
							/>

							<div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
								<div className="p-2.5 rounded-lg bg-surface-muted/50 dark:bg-muted/20 border border-border">
									<span className="font-semibold text-foreground block mb-0.5">UGC & AICTE Regulations</span>
									Most Indian universities mandate a minimum 75% attendance for semester exam admit card eligibility.
								</div>

								<div className="p-2.5 rounded-lg bg-surface-muted/50 dark:bg-muted/20 border border-border">
									<span className="font-semibold text-foreground block mb-0.5">Medical Condonation</span>
									Up to 10% attendance shortage (down to 65%) can often be condoned with verified medical certificates upon institutional approval.
								</div>
							</div>
						</ToolPanel>

						<ToolPanel className="space-y-3">
							<ToolSectionTitle
								icon={<HelpCircle className="h-4 w-4 text-muted-foreground" />}
								title="Privacy Protection"
							/>
							<p className="text-xs text-muted-foreground leading-relaxed">
								Your academic records, attendance figures, and subject names remain strictly inside your browser local storage. No student identifiers or college credentials are ever transmitted.
							</p>
							<ToolPrivacyNote>Processed 100% locally in your device sandbox.</ToolPrivacyNote>
						</ToolPanel>
					</ToolGridSide>
				</ToolGrid>
			) : (
				/* Multi-Subject Roster Tab */
				<ToolGrid>
					<ToolGridMain className="space-y-6">
						<ToolPanel className="space-y-5">
							<div className="flex items-center justify-between">
								<ToolSectionTitle
									icon={<BookOpen className="h-4 w-4 text-primary" />}
									title="Semester Course Roster"
									subtitle="Track attendance across all registered courses and view aggregate eligibility"
								/>
								<Button size="sm" onClick={handleAddSubject} className="h-8 gap-1.5 text-xs rounded-xl">
									<Plus className="h-3.5 w-3.5" />
									Add Course
								</Button>
							</div>

							<div className="space-y-3">
								{subjects.map((sub) => {
									const pct = sub.total > 0 ? (sub.attended / sub.total) * 100 : 0;
									const isLow = pct < targetPct;

									return (
										<div
											key={sub.id}
											className="p-3.5 rounded-xl border border-border bg-card/60 space-y-3 transition-colors"
										>
											<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
												<Input
													value={sub.name}
													onChange={(e) => handleUpdateSubject(sub.id, "name", e.target.value)}
													className="font-medium text-sm h-8 max-w-xs bg-transparent"
													placeholder="Course Name"
												/>
												<div className="flex items-center gap-2 self-end sm:self-auto">
													<Badge
														variant="outline"
														className={`text-xs font-mono font-semibold ${
															isLow ? "border-rose-500/40 text-rose-500 bg-rose-500/10" : "border-emerald-500/40 text-emerald-500 bg-emerald-500/10"
														}`}
													>
														{pct.toFixed(1)}%
													</Badge>
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8 text-muted-foreground hover:text-rose-500"
														onClick={() => handleDeleteSubject(sub.id)}
														disabled={subjects.length <= 1}
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</div>

											<div className="grid grid-cols-2 gap-3">
												<div>
													<Label className="text-[11px] text-muted-foreground">Attended</Label>
													<Input
														type="number"
														min="0"
														value={sub.attended}
														onChange={(e) => handleUpdateSubject(sub.id, "attended", parseInt(e.target.value, 10) || 0)}
														className="h-8 text-xs mt-1"
													/>
												</div>
												<div>
													<Label className="text-[11px] text-muted-foreground">Total Held</Label>
													<Input
														type="number"
														min="0"
														value={sub.total}
														onChange={(e) => handleUpdateSubject(sub.id, "total", parseInt(e.target.value, 10) || 0)}
														className="h-8 text-xs mt-1"
													/>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</ToolPanel>
					</ToolGridMain>

					<ToolGridSide className="space-y-6">
						<ToolPanel className="space-y-4">
							<ToolSectionTitle
								icon={<TrendingUp className="h-4 w-4 text-primary" />}
								title="Roster Aggregate"
								subtitle="Cumulative semester attendance"
							/>

							<div className="text-center p-4 rounded-xl bg-surface-muted/50 dark:bg-muted/20 border border-border">
								<div className={`text-4xl font-mono font-bold ${
									rosterSummary.overallPct >= targetPct
										? "text-emerald-600 dark:text-emerald-400"
										: "text-rose-600 dark:text-rose-400"
								}`}>
									{rosterSummary.overallPct.toFixed(1)}%
								</div>
								<div className="text-xs text-muted-foreground mt-1">
									{rosterSummary.totalAtt} / {rosterSummary.totalCond} Total Classes
								</div>
							</div>

							<div className="space-y-2 text-xs">
								<div className="flex justify-between p-2 rounded-lg bg-surface-muted/40 border border-border">
									<span className="text-muted-foreground">Courses Tracked:</span>
									<span className="font-semibold text-foreground">{subjects.length}</span>
								</div>
								<div className="flex justify-between p-2 rounded-lg bg-surface-muted/40 border border-border">
									<span className="text-muted-foreground">Courses with Shortage:</span>
									<span className={`font-semibold ${rosterSummary.lowCount > 0 ? "text-rose-500" : "text-emerald-500"}`}>
										{rosterSummary.lowCount}
									</span>
								</div>
							</div>
						</ToolPanel>
					</ToolGridSide>
				</ToolGrid>
			)}
		</ToolShell>
	);
}
