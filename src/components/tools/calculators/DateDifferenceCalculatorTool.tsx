"use client";

import React, { useState, useEffect } from "react";
import { 
	CalendarIcon, 
	CopyIcon, 
	CheckCircleIcon,
	ClockIcon,
	ArrowRightIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "../shared/WorkspaceComponents";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface DateDifferenceResult {
	years: number;
	months: number;
	days: number;
	totalDays: number;
	weeks: number;
	remainingDaysForWeeks: number;
	totalHours: number;
	totalMinutes: number;
	isSwapped: boolean;
}

export default function DateDifferenceCalculatorTool() {
	const todayStr = new Date().toISOString().split("T")[0];
	const [startDate, setStartDate] = useState(todayStr);
	const [endDate, setEndDate] = useState(todayStr);
	const [result, setResult] = useState<DateDifferenceResult | null>(null);
	const [copied, setCopied] = useState(false);

	const calculateDifference = () => {
		if (!startDate || !endDate) return;

		const start = new Date(startDate);
		const end = new Date(endDate);

		// If start is after end, swap them or show negative, swapping makes it user friendly
		const isSwapped = start > end;
		const date1 = isSwapped ? end : start;
		const date2 = isSwapped ? start : end;

		const diffTime = Math.abs(date2.getTime() - date1.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		// Calculate years, months, days
		let years = date2.getFullYear() - date1.getFullYear();
		let months = date2.getMonth() - date1.getMonth();
		let days = date2.getDate() - date1.getDate();

		if (days < 0) {
			months -= 1;
			// Get days in the previous month of date2
			const prevMonth = new Date(date2.getFullYear(), date2.getMonth(), 0);
			days += prevMonth.getDate();
		}

		if (months < 0) {
			years -= 1;
			months += 12;
		}

		// Calculate alternative values
		const weeks = Math.floor(diffDays / 7);
		const remainingDaysForWeeks = diffDays % 7;
		const totalHours = diffDays * 24;
		const totalMinutes = totalHours * 60;

		setResult({
			years,
			months,
			days,
			totalDays: diffDays,
			weeks,
			remainingDaysForWeeks,
			totalHours,
			totalMinutes,
			isSwapped
		});
	};

	useEffect(() => {
		calculateDifference();
	}, [startDate, endDate]);

	const copySummary = () => {
		if (!result) return;
		const summary = `Date Difference:\n- Duration: ${result.years} years, ${result.months} months, ${result.days} days\n- Total Days: ${result.totalDays} days\n- Total Hours: ${result.totalHours} hours`;
		navigator.clipboard.writeText(summary);
		setCopied(true);
		toast.success("Summary copied!");
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="w-full max-w-5xl mx-auto space-y-12 pb-24 animate-in">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
				{/* Inputs */}
				<div className="lg:col-span-6 space-y-8">
					<GlassCard className="p-8 space-y-6">
						<h3 className="text-2xl font-bold flex items-center gap-2 mb-4">
							<CalendarIcon className="text-primary w-6 h-6" />
							Select Date Range
						</h3>

						<div className="space-y-6">
							<div className="space-y-2">
								<label className="text-sm font-bold">Start Date</label>
								<input
									type="date"
									value={startDate}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
									className="h-14 w-full rounded-2xl bg-muted/20 border border-border/40 px-6 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
								/>
							</div>

							<div className="flex justify-center my-2">
								<ArrowRightIcon className="text-muted-foreground w-6 h-6 rotate-90 lg:rotate-0" />
							</div>

							<div className="space-y-2">
								<label className="text-sm font-bold">End Date</label>
								<input
									type="date"
									value={endDate}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
									className="h-14 w-full rounded-2xl bg-muted/20 border border-border/40 px-6 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
								/>
							</div>
						</div>
					</GlassCard>
				</div>

				{/* Output Display */}
				<div className="lg:col-span-6 space-y-8">
					<GlassCard className="p-8 flex flex-col h-full justify-between">
						<div className="space-y-6">
							<div className="flex justify-between items-center">
								<span className="font-bold text-2xl">Results</span>
								<ClockIcon className="text-muted-foreground w-6 h-6" />
							</div>

							{result && (
								<div className="space-y-6">
									{result.isSwapped && (
										<div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl text-xs font-semibold">
											Start date was after end date. Values were swapped.
										</div>
									)}

									<div className="grid grid-cols-3 gap-4">
										<div className="p-4 bg-muted/15 border border-border/40 rounded-2xl text-center">
											<div className="text-3xl font-black text-primary font-mono">{result.years}</div>
											<div className="text-xs text-muted-foreground font-bold mt-1">Years</div>
										</div>
										<div className="p-4 bg-muted/15 border border-border/40 rounded-2xl text-center">
											<div className="text-3xl font-black text-primary font-mono">{result.months}</div>
											<div className="text-xs text-muted-foreground font-bold mt-1">Months</div>
										</div>
										<div className="p-4 bg-muted/15 border border-border/40 rounded-2xl text-center">
											<div className="text-3xl font-black text-primary font-mono">{result.days}</div>
											<div className="text-xs text-muted-foreground font-bold mt-1">Days</div>
										</div>
									</div>

									<div className="border-t border-border/40 pt-6 space-y-4">
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground font-medium">Total Days:</span>
											<span className="font-bold text-foreground font-mono">{result.totalDays.toLocaleString()} days</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground font-medium">Total Weeks:</span>
											<span className="font-bold text-foreground font-mono">{result.weeks} weeks, {result.remainingDaysForWeeks} days</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground font-medium">Total Hours:</span>
											<span className="font-bold text-foreground font-mono">{result.totalHours.toLocaleString()} hours</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground font-medium">Total Minutes:</span>
											<span className="font-bold text-foreground font-mono">{result.totalMinutes.toLocaleString()} mins</span>
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
										COPIED SUMMARY!
									</>
								) : (
									<>
										<CopyIcon className="w-5 h-5" />
										COPY SUMMARY
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
