"use client";

import { useState, useMemo } from "react";
import { DollarSign, ShieldCheck, Briefcase, Calendar, Percent, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function FreelanceHourlyRateCalculator() {
	const [targetAnnualIncome, setTargetAnnualIncome] = useState<number>(85000);
	const [annualExpenses, setAnnualExpenses] = useState<number>(12000);
	const [taxRate, setTaxRate] = useState<number>(28);
	const [vacationWeeks, setVacationWeeks] = useState<number>(4);
	const [billableHoursPerWeek, setBillableHoursPerWeek] = useState<number>(25);
	const [profitMargin, setProfitMargin] = useState<number>(15);

	// Calculation breakdown
	const results = useMemo(() => {
		// Total net pre-tax needed = target income + expenses
		const totalNeededNet = targetAnnualIncome + annualExpenses;

		// Gross required taking into account income taxes
		const grossIncomeRequired = totalNeededNet / (1 - taxRate / 100);

		// With buffer profit margin
		const totalRevenueTarget = grossIncomeRequired * (1 + profitMargin / 100);

		// Total working weeks = 52 - vacation weeks
		const workingWeeks = Math.max(1, 52 - vacationWeeks);

		// Total annual billable hours
		const totalBillableHours = workingWeeks * billableHoursPerWeek;

		// Target hourly rate
		const hourlyRate = Math.round(totalRevenueTarget / Math.max(1, totalBillableHours));

		// Daily rate (assuming 7h day based on billable split)
		const dayRate = Math.round(hourlyRate * (billableHoursPerWeek / 5));

		// Monthly retainer (1/12th of annual revenue target)
		const monthlyRetainer = Math.round(totalRevenueTarget / 12);

		// Weekly target
		const weeklyTarget = Math.round(totalRevenueTarget / workingWeeks);

		return {
			hourlyRate,
			dayRate,
			monthlyRetainer,
			weeklyTarget,
			totalRevenueTarget: Math.round(totalRevenueTarget),
			totalBillableHours,
			workingWeeks,
		};
	}, [targetAnnualIncome, annualExpenses, taxRate, vacationWeeks, billableHoursPerWeek, profitMargin]);

	return (
		<div className="space-y-8 max-w-5xl mx-auto">
			{/* Privacy Badge */}
			<div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
				<ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
				<span>100% Client-Side Calculator: Your financial figures and rate projections remain confidential on your device.</span>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
				{/* Input Parameters */}
				<div className="lg:col-span-6 p-6 rounded-2xl bg-card border border-border/60 shadow-sm space-y-5">
					<div className="flex items-center gap-2">
						<div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
							<Briefcase className="h-4 w-4" />
						</div>
						<h3 className="text-base font-bold text-foreground">Income & Expense Inputs</h3>
					</div>

					<div className="space-y-4 text-xs">
						<div className="space-y-1.5">
							<Label htmlFor="target-income" className="font-semibold text-foreground">
								Desired Annual Take-Home Income ($)
							</Label>
							<Input
								id="target-income"
								type="number"
								min={1000}
								step={1000}
								value={targetAnnualIncome}
								onChange={(e) => setTargetAnnualIncome(Number(e.target.value) || 0)}
								className="h-9 text-xs"
							/>
						</div>

						<div className="space-y-1.5">
							<Label htmlFor="annual-expenses" className="font-semibold text-foreground">
								Annual Business Expenses ($) (Software, Equipment, Health)
							</Label>
							<Input
								id="annual-expenses"
								type="number"
								min={0}
								step={500}
								value={annualExpenses}
								onChange={(e) => setAnnualExpenses(Number(e.target.value) || 0)}
								className="h-9 text-xs"
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1.5">
								<Label htmlFor="tax-rate" className="font-semibold text-foreground">
									Estimated Tax Rate (%)
								</Label>
								<Input
									id="tax-rate"
									type="number"
									min={0}
									max={60}
									value={taxRate}
									onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
									className="h-9 text-xs"
								/>
							</div>

							<div className="space-y-1.5">
								<Label htmlFor="profit-margin" className="font-semibold text-foreground">
									Profit Buffer (%)
								</Label>
								<Input
									id="profit-margin"
									type="number"
									min={0}
									max={50}
									value={profitMargin}
									onChange={(e) => setProfitMargin(Number(e.target.value) || 0)}
									className="h-9 text-xs"
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1.5">
								<Label htmlFor="vacation-weeks" className="font-semibold text-foreground">
									Vacation & Sick Weeks / Year
								</Label>
								<Input
									id="vacation-weeks"
									type="number"
									min={0}
									max={20}
									value={vacationWeeks}
									onChange={(e) => setVacationWeeks(Number(e.target.value) || 0)}
									className="h-9 text-xs"
								/>
							</div>

							<div className="space-y-1.5">
								<Label htmlFor="billable-hours" className="font-semibold text-foreground">
									Billable Hours / Week (Avg 20-30h)
								</Label>
								<Input
									id="billable-hours"
									type="number"
									min={5}
									max={60}
									value={billableHoursPerWeek}
									onChange={(e) => setBillableHoursPerWeek(Number(e.target.value) || 0)}
									className="h-9 text-xs"
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Results & Rate Breakdown */}
				<div className="lg:col-span-6 space-y-5">
					{/* Primary Metric Card */}
					<div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg space-y-4">
						<div className="flex items-center justify-between">
							<span className="text-xs font-bold uppercase tracking-widest text-blue-100">
								Recommended Hourly Rate
							</span>
							<Sparkles className="w-4 h-4 text-blue-200" />
						</div>

						<div className="flex items-baseline gap-2">
							<span className="text-4xl md:text-5xl font-black tracking-tight">${results.hourlyRate}</span>
							<span className="text-blue-200 text-sm font-semibold">/ hour</span>
						</div>

						<p className="text-xs text-blue-100/90 leading-relaxed border-t border-white/20 pt-3">
							Based on {results.totalBillableHours} billable hours across {results.workingWeeks} active working weeks.
						</p>
					</div>

					{/* Breakdown Cards */}
					<div className="grid grid-cols-2 gap-4">
						<div className="p-4 rounded-xl bg-card border border-border/60 shadow-sm space-y-1">
							<span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Estimated Day Rate</span>
							<p className="text-xl font-black text-foreground">${results.dayRate} <span className="text-xs font-normal text-muted-foreground">/ day</span></p>
						</div>

						<div className="p-4 rounded-xl bg-card border border-border/60 shadow-sm space-y-1">
							<span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Monthly Retainer</span>
							<p className="text-xl font-black text-foreground">${results.monthlyRetainer} <span className="text-xs font-normal text-muted-foreground">/ mo</span></p>
						</div>

						<div className="p-4 rounded-xl bg-card border border-border/60 shadow-sm space-y-1">
							<span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Weekly Target</span>
							<p className="text-xl font-black text-foreground">${results.weeklyTarget} <span className="text-xs font-normal text-muted-foreground">/ wk</span></p>
						</div>

						<div className="p-4 rounded-xl bg-card border border-border/60 shadow-sm space-y-1">
							<span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Gross Revenue Goal</span>
							<p className="text-xl font-black text-foreground">${results.totalRevenueTarget.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">/ yr</span></p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
