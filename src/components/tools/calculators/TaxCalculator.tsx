"use client";

import { useMemo, useState } from "react";
import { IndianRupee, Info, TrendingDown, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TaxCalculator() {
	const [grossIncome, setGrossIncome] = useState("1200000");
	const [deduction80C, setDeduction80C] = useState("150000");
	const [deduction80D, setDeduction80D] = useState("25000");
	const [hraExemption, setHraExemption] = useState("50000");
	const [otherDeductions, setOtherDeductions] = useState("0");

	const taxStats = useMemo(() => {
		const gross = parseFloat(grossIncome) || 0;
		
		// 1. New Regime Calculation (FY 2026-27 / AY 2027-28)
		// Standard deduction for New Regime is ₹75,000
		const standardDeductionNew = 75000;
		const taxableNew = Math.max(0, gross - standardDeductionNew);
		let taxNew = 0;

		// New slabs:
		// Up to 3L: Nil
		// 3L to 7L: 5%
		// 7L to 10L: 10%
		// 10L to 12L: 15%
		// 12L to 15L: 20%
		// Above 15L: 30%
		if (taxableNew > 1500000) {
			taxNew += (taxableNew - 1500000) * 0.30;
			taxNew += 300000 * 0.20; // 12L to 15L
			taxNew += 200000 * 0.15; // 10L to 12L
			taxNew += 300000 * 0.10; // 7L to 10L
			taxNew += 400000 * 0.05; // 3L to 7L
		} else if (taxableNew > 1200000) {
			taxNew += (taxableNew - 1200000) * 0.20;
			taxNew += 200000 * 0.15;
			taxNew += 300000 * 0.10;
			taxNew += 400000 * 0.05;
		} else if (taxableNew > 1000000) {
			taxNew += (taxableNew - 1000000) * 0.15;
			taxNew += 300000 * 0.10;
			taxNew += 400000 * 0.05;
		} else if (taxableNew > 700000) {
			taxNew += (taxableNew - 700000) * 0.10;
			taxNew += 400000 * 0.05;
		} else if (taxableNew > 300000) {
			taxNew += (taxableNew - 300000) * 0.05;
		}

		// Rebate under Section 87A: If taxable income <= ₹7,00,000, tax is fully rebated
		if (taxableNew <= 700000) {
			taxNew = 0;
		}
		
		// Health & Education Cess: 4%
		const cessNew = taxNew * 0.04;
		const totalTaxNew = taxNew + cessNew;

		// 2. Old Regime Calculation
		const standardDeductionOld = 50000;
		const ded80C = Math.min(150000, parseFloat(deduction80C) || 0);
		const ded80D = Math.min(25000, parseFloat(deduction80D) || 0);
		const hra = parseFloat(hraExemption) || 0;
		const other = parseFloat(otherDeductions) || 0;

		const totalDeductionsOld = standardDeductionOld + ded80C + ded80D + hra + other;
		const taxableOld = Math.max(0, gross - totalDeductionsOld);
		let taxOld = 0;

		// Old slabs:
		// Up to 2.5L: Nil
		// 2.5L to 5L: 5%
		// 5L to 10L: 20%
		// Above 10L: 30%
		if (taxableOld > 1000000) {
			taxOld += (taxableOld - 1000000) * 0.30;
			taxOld += 500000 * 0.20; // 5L to 10L
			taxOld += 250000 * 0.05; // 2.5L to 5L
		} else if (taxableOld > 500000) {
			taxOld += (taxableOld - 500000) * 0.20;
			taxOld += 250000 * 0.05;
		} else if (taxableOld > 250000) {
			taxOld += (taxableOld - 250000) * 0.05;
		}

		// Rebate under Section 87A for Old Regime: If taxable income <= ₹5,00,000, tax is rebated up to ₹12,500
		if (taxableOld <= 500000) {
			taxOld = 0;
		}

		const cessOld = taxOld * 0.04;
		const totalTaxOld = taxOld + cessOld;

		const savings = Math.abs(totalTaxNew - totalTaxOld);
		const betterRegime = totalTaxNew < totalTaxOld ? "New Regime" : "Old Regime";

		return {
			taxableNew,
			totalTaxNew,
			taxableOld,
			totalTaxOld,
			savings,
			betterRegime
		};
	}, [grossIncome, deduction80C, deduction80D, hraExemption, otherDeductions]);

	const formatINR = (val: number) => {
		return new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: "INR",
			maximumFractionDigits: 0
		}).format(val);
	};

	return (
		<div className="space-y-6">
			{/* Input Panels */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
				<div className="lg:col-span-6 space-y-4">
					<Card className="border-border/40 bg-card/30 backdrop-blur-sm shadow-md">
						<CardHeader>
							<CardTitle className="text-base flex items-center gap-2">
								<IndianRupee className="h-5 w-5 text-primary" />
								Income & Allowances
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="gross-income">Gross Annual Salary (INR)</Label>
								<Input
									id="gross-income"
									type="number"
									value={grossIncome}
									onChange={(e) => setGrossIncome(e.target.value)}
									className="h-10 text-base font-mono"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="deduction-80c">Section 80C Deductions (Max ₹1.5L)</Label>
								<Input
									id="deduction-80c"
									type="number"
									value={deduction80C}
									onChange={(e) => setDeduction80C(e.target.value)}
									className="h-10 text-base font-mono"
								/>
								<span className="text-[10px] text-muted-foreground block">
									EPF, PPF, ELSS, Life Insurance premium, etc. (Old regime only)
								</span>
							</div>

							<div className="space-y-2">
								<Label htmlFor="deduction-80d">Section 80D Medical (Max ₹25K)</Label>
								<Input
									id="deduction-80d"
									type="number"
									value={deduction80D}
									onChange={(e) => setDeduction80D(e.target.value)}
									className="h-10 text-base font-mono"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="hra-exemption">HRA Exemption / Rent Allowance</Label>
								<Input
									id="hra-exemption"
									type="number"
									value={hraExemption}
									onChange={(e) => setHraExemption(e.target.value)}
									className="h-10 text-base font-mono"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="other-deductions">Other Deductions (LTA, 80CCD, etc.)</Label>
								<Input
									id="other-deductions"
									type="number"
									value={otherDeductions}
									onChange={(e) => setOtherDeductions(e.target.value)}
									className="h-10 text-base font-mono"
								/>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Results / Analysis Panel */}
				<div className="lg:col-span-6 space-y-6">
					<Card className="border-emerald-500/20 bg-emerald-500/[0.02] shadow-lg relative overflow-hidden">
						<div className="absolute top-0 right-0 p-4">
							<Check className="h-6 w-6 text-emerald-500 animate-pulse" />
						</div>
						<CardContent className="p-6 text-center space-y-4">
							<div className="space-y-1">
								<span className="text-xs text-muted-foreground uppercase font-bold tracking-widest block">Recommended Regime</span>
								<h3 className="text-3xl font-black text-foreground">{taxStats.betterRegime}</h3>
							</div>

							{taxStats.savings > 0 && (
								<div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 max-w-xs mx-auto space-y-1">
									<span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center gap-1">
										<TrendingDown className="h-4 w-4" /> Estimated Tax Savings
									</span>
									<span className="text-2xl font-mono font-black text-emerald-600 dark:text-emerald-400">
										{formatINR(taxStats.savings)}
									</span>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Side by Side regimes */}
					<div className="grid grid-cols-2 gap-4">
						<Card className="border-border/30 bg-card/25">
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-bold text-muted-foreground uppercase">New Regime (FY 26-27)</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div>
									<span className="text-[10px] text-muted-foreground block">Taxable Income</span>
									<span className="text-base font-mono font-bold">{formatINR(taxStats.taxableNew)}</span>
								</div>
								<div>
									<span className="text-[10px] text-muted-foreground block">Total Tax + Cess</span>
									<span className="text-lg font-mono font-black text-foreground">{formatINR(taxStats.totalTaxNew)}</span>
								</div>
							</CardContent>
						</Card>

						<Card className="border-border/30 bg-card/25">
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-bold text-muted-foreground uppercase">Old Regime</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div>
									<span className="text-[10px] text-muted-foreground block">Taxable Income</span>
									<span className="text-base font-mono font-bold">{formatINR(taxStats.taxableOld)}</span>
								</div>
								<div>
									<span className="text-[10px] text-muted-foreground block">Total Tax + Cess</span>
									<span className="text-lg font-mono font-black text-foreground">{formatINR(taxStats.totalTaxOld)}</span>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Info Callout */}
					<div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/[0.03] text-xs text-blue-600 dark:text-blue-400 flex gap-2.5 leading-relaxed">
						<Info className="h-4 w-4 shrink-0 mt-0.5" />
						<div>
							<span className="font-bold block mb-1">FY 2026-27 New Regime Highlights:</span>
							The New Tax Regime standard deduction is set to ₹75,000. Tax rebate under 87A remains applicable up to a taxable income of ₹7,00,000. Under the New Regime, deductions under 80C, 80D, and HRA cannot be claimed.
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
