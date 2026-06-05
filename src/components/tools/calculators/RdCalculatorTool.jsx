"use client";

import React, { useState, useEffect } from "react";
import { 
	CoinsIcon, 
	CopyIcon, 
	CheckCircleIcon,
	TrendingUpIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "../shared/WorkspaceComponents";
import { toast } from "sonner";

export default function RdCalculatorTool() {
	const [monthlyInstallment, setMonthlyInstallment] = useState("5000");
	const [rateOfInterest, setRateOfInterest] = useState("6.5");
	const [tenureMonths, setTenureMonths] = useState("24");

	const [result, setResult] = useState(null);
	const [copied, setCopied] = useState(false);

	const calculateMaturity = () => {
		const P = parseFloat(monthlyInstallment);
		const R = parseFloat(rateOfInterest);
		const months = parseInt(tenureMonths, 10);

		if (isNaN(P) || isNaN(R) || isNaN(months) || P <= 0 || R <= 0 || months <= 0) {
			setResult(null);
			return;
		}

		// Indian Bank RD compounding formula (compounded quarterly)
		// M = P * ((1 + r/4)^n - 1) / (1 - (1 + r/4)^(-1/3))
		// where r = R/100, n = quarters = months / 3
		const r = R / 100;
		const n = months / 3; // number of quarters

		const compoundFactor = Math.pow(1 + r / 4, n);
		const discountFactor = Math.pow(1 + r / 4, -1 / 3);

		const maturityValue = P * (compoundFactor - 1) / (1 - discountFactor);
		const totalInvested = P * months;
		const interestEarned = Math.max(0, maturityValue - totalInvested);

		setResult({
			totalInvested: Math.round(totalInvested),
			interestEarned: Math.round(interestEarned),
			maturityValue: Math.round(maturityValue)
		});
	};

	useEffect(() => {
		calculateMaturity();
	}, [monthlyInstallment, rateOfInterest, tenureMonths]);

	const copySummary = () => {
		if (!result) return;
		const summary = `Recurring Deposit (RD) Summary:\n- Monthly Deposit: ₹${monthlyInstallment}\n- Total Invested: ₹${result.totalInvested.toLocaleString()}\n- Interest Earned: ₹${result.interestEarned.toLocaleString()}\n- Maturity Value: ₹${result.maturityValue.toLocaleString()}`;
		navigator.clipboard.writeText(summary);
		setCopied(true);
		toast.success("RD details copied!");
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="w-full max-w-5xl mx-auto space-y-12 pb-24 animate-in">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
				{/* Inputs */}
				<div className="lg:col-span-7 space-y-6">
					<GlassCard className="p-8 space-y-6">
						<h3 className="text-2xl font-bold flex items-center gap-2 mb-4">
							<CoinsIcon className="text-primary w-6 h-6" />
							Investment Plan
						</h3>

						<div className="space-y-6">
							<div className="space-y-2">
								<label className="text-sm font-bold">Monthly Deposit (₹)</label>
								<input
									type="number"
									value={monthlyInstallment}
									onChange={(e) => setMonthlyInstallment(e.target.value)}
									className="h-14 w-full rounded-2xl bg-muted/20 border border-border/40 px-6 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
								/>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
								<div className="space-y-2">
									<label className="text-sm font-bold">Annual Interest Rate (%)</label>
									<input
										type="number"
										step="0.05"
										value={rateOfInterest}
										onChange={(e) => setRateOfInterest(e.target.value)}
										className="h-14 w-full rounded-2xl bg-muted/20 border border-border/40 px-6 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
									/>
								</div>

								<div className="space-y-2">
									<label className="text-sm font-bold">Tenure (Months)</label>
									<input
										type="number"
										value={tenureMonths}
										onChange={(e) => setTenureMonths(e.target.value)}
										className="h-14 w-full rounded-2xl bg-muted/20 border border-border/40 px-6 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
									/>
								</div>
							</div>
						</div>
					</GlassCard>
				</div>

				{/* Output Display */}
				<div className="lg:col-span-5 space-y-8">
					<GlassCard className="p-8 flex flex-col h-full justify-between">
						<div className="space-y-6">
							<div className="flex justify-between items-center">
								<span className="font-bold text-2xl">Maturity Summary</span>
								<TrendingUpIcon className="text-primary w-6 h-6 animate-pulse" />
							</div>

							{result && (
								<div className="space-y-6">
									<div className="p-6 bg-primary/10 border border-primary/20 rounded-3xl text-center">
										<div className="text-4xl font-black text-primary font-mono">₹{result.maturityValue.toLocaleString()}</div>
										<div className="text-sm text-muted-foreground font-bold mt-2">Expected Maturity Value</div>
									</div>

									<div className="border-t border-border/40 pt-6 space-y-4">
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground font-medium">Total Investment:</span>
											<span className="font-bold text-foreground font-mono">₹{result.totalInvested.toLocaleString()}</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground font-medium">Interest Earned:</span>
											<span className="font-bold text-emerald-500 font-mono">+₹{result.interestEarned.toLocaleString()}</span>
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
										COPIED RD DETAILS!
									</>
								) : (
									<>
										<CopyIcon className="w-5 h-5" />
										COPY RD DETAILS
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
