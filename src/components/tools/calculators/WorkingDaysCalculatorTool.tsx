"use client";

import React, { useState, useEffect } from "react";
import { 
	CalendarIcon, 
	CopyIcon, 
	CheckCircleIcon,
	ClockIcon,
	SettingsIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "../shared/WorkspaceComponents";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface WorkingDaysResult {
	totalDays: number;
	saturdaysExcluded: number;
	sundaysExcluded: number;
	totalSaturdays: number;
	totalSundays: number;
	customHolidaysExcluded: number;
	workingDays: number;
	isSwapped: boolean;
}

export default function WorkingDaysCalculatorTool() {
	const todayStr = new Date().toISOString().split("T")[0];
	const [startDate, setStartDate] = useState(todayStr);
	const [endDate, setEndDate] = useState(todayStr);
	const [excludeSat, setExcludeSat] = useState(true);
	const [excludeSun, setExcludeSun] = useState(true);
	const [customHolidays, setCustomHolidays] = useState(0);

	const [result, setResult] = useState<WorkingDaysResult | null>(null);
	const [copied, setCopied] = useState(false);

	const calculateWorkingDays = () => {
		if (!startDate || !endDate) return;

		const start = new Date(startDate);
		const end = new Date(endDate);

		const isSwapped = start > end;
		const date1 = new Date(isSwapped ? end : start);
		const date2 = new Date(isSwapped ? start : end);

		// Calculate total calendar days
		const diffTime = Math.abs(date2.getTime() - date1.getTime());
		const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive of start and end

		let workingDays = 0;
		let Saturdays = 0;
		let Sundays = 0;

		const current = new Date(date1);
		while (current <= date2) {
			const day = current.getDay(); // 0 is Sunday, 6 is Saturday
			const isSat = day === 6;
			const isSun = day === 0;

			if (isSat) Saturdays++;
			if (isSun) Sundays++;

			let isWorking = true;
			if (excludeSat && isSat) isWorking = false;
			if (excludeSun && isSun) isWorking = false;

			if (isWorking) {
				workingDays++;
			}

			current.setDate(current.getDate() + 1);
		}

		// Deduct custom public holidays
		const finalWorkingDays = Math.max(0, workingDays - Number(customHolidays));

		setResult({
			totalDays,
			saturdaysExcluded: excludeSat ? Saturdays : 0,
			sundaysExcluded: excludeSun ? Sundays : 0,
			totalSaturdays: Saturdays,
			totalSundays: Sundays,
			customHolidaysExcluded: Number(customHolidays),
			workingDays: finalWorkingDays,
			isSwapped
		});
	};

	useEffect(() => {
		calculateWorkingDays();
	}, [startDate, endDate, excludeSat, excludeSun, customHolidays]);

	const copySummary = () => {
		if (!result) return;
		const summary = `Working Days Calculation:\n- Total Period: ${result.totalDays} calendar days\n- Excluded Weekends: Saturdays: ${result.saturdaysExcluded}, Sundays: ${result.sundaysExcluded}\n- Excluded Holidays: ${result.customHolidaysExcluded}\n- Net Working Days: ${result.workingDays} business days`;
		navigator.clipboard.writeText(summary);
		setCopied(true);
		toast.success("Working days summary copied!");
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="w-full max-w-5xl mx-auto space-y-12 pb-24 animate-in">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
				{/* Settings & Inputs */}
				<div className="lg:col-span-7 space-y-6">
					<GlassCard className="p-8 space-y-6">
						<h3 className="text-2xl font-bold flex items-center gap-2 mb-4">
							<CalendarIcon className="text-primary w-6 h-6" />
							Date Selection
						</h3>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
							<div className="space-y-2">
								<label className="text-sm font-bold">Start Date</label>
								<input
									type="date"
									value={startDate}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
									className="h-14 w-full rounded-2xl bg-muted/20 border border-border/40 px-6 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
								/>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-bold">End Date (Inclusive)</label>
								<input
									type="date"
									value={endDate}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
									className="h-14 w-full rounded-2xl bg-muted/20 border border-border/40 px-6 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
								/>
							</div>
						</div>
					</GlassCard>

					<GlassCard className="p-8 space-y-6">
						<h3 className="text-xl font-bold flex items-center gap-2 mb-4">
							<SettingsIcon className="text-primary w-5 h-5" />
							Weekend & Holiday Filters
						</h3>

						<div className="space-y-4">
							<div className="flex items-center justify-between p-4 rounded-xl bg-muted/10 border border-border/40">
								<Label htmlFor="exclude-sat" className="font-bold text-base">Exclude Saturdays</Label>
								<Switch 
									id="exclude-sat" 
									checked={excludeSat} 
									onCheckedChange={setExcludeSat}
									className="scale-110"
								/>
							</div>

							<div className="flex items-center justify-between p-4 rounded-xl bg-muted/10 border border-border/40">
								<Label htmlFor="exclude-sun" className="font-bold text-base">Exclude Sundays</Label>
								<Switch 
									id="exclude-sun" 
									checked={excludeSun} 
									onCheckedChange={setExcludeSun}
									className="scale-110"
								/>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-bold">Custom Holidays to Deduct (Days)</label>
								<input
									type="number"
									min="0"
									max="365"
									value={customHolidays}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomHolidays(Math.max(0, parseInt(e.target.value, 10) || 0))}
									className="h-14 w-full rounded-2xl bg-muted/20 border border-border/40 px-6 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
								/>
							</div>
						</div>
					</GlassCard>
				</div>

				{/* Display Results */}
				<div className="lg:col-span-5 space-y-8">
					<GlassCard className="p-8 flex flex-col h-full justify-between">
						<div className="space-y-6">
							<div className="flex justify-between items-center">
								<span className="font-bold text-2xl">Working Days</span>
								<ClockIcon className="text-muted-foreground w-6 h-6" />
							</div>

							{result && (
								<div className="space-y-6">
									<div className="p-6 bg-primary/10 border border-primary/20 rounded-3xl text-center">
										<div className="text-5xl font-black text-primary font-mono">{result.workingDays}</div>
										<div className="text-sm text-muted-foreground font-bold mt-2">Net Business Days</div>
									</div>

									<div className="border-t border-border/40 pt-6 space-y-4">
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground font-medium">Total Calendar Days:</span>
											<span className="font-bold text-foreground font-mono">{result.totalDays}</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground font-medium">Saturdays Excluded:</span>
											<span className="font-bold text-foreground font-mono">{result.saturdaysExcluded}</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground font-medium">Sundays Excluded:</span>
											<span className="font-bold text-foreground font-mono">{result.sundaysExcluded}</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground font-medium">Public Holidays Excluded:</span>
											<span className="font-bold text-foreground font-mono">{result.customHolidaysExcluded}</span>
										</div>
									</div>
								</div>
							)}
						</div>

						<div className="mt-8">
							<Button
								onClick={copySummary}
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
										COPY WORKING DAYS
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
