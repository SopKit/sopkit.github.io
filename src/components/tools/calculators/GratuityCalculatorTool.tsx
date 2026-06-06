"use client";

import React, { useState, useEffect } from "react";
import { 
	BriefcaseIcon, 
	CopyIcon, 
	CheckCircleIcon,
	TrendingUpIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "../shared/WorkspaceComponents";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface GratuityResult {
	rawGratuity: number;
	cappedGratuity: number;
	isCapped: boolean;
	tenureCalculated: number;
}

export default function GratuityCalculatorTool() {
	const [basicSalary, setBasicSalary] = useState("50000");
	const [yearsOfService, setYearsOfService] = useState("10");
	const [isCovered, setIsCovered] = useState(true); // Covered under Gratuity Act 1972

	const [result, setResult] = useState<GratuityResult | null>(null);
	const [copied, setCopied] = useState(false);

	const calculateGratuity = () => {
		const salary = parseFloat(basicSalary);
		const tenure = parseFloat(yearsOfService);

		if (isNaN(salary) || isNaN(tenure) || salary <= 0 || tenure <= 0) {
			setResult(null);
			return;
		}

		// Gratuity formulas
		let gratuityValue = 0;
		if (isCovered) {
			// Formula: (15/26) * Last Drawn Basic Salary * Completed Years of Service
			// Years of service: Rounded to nearest whole number if > 6 months
			const completedYears = Math.round(tenure);
			gratuityValue = (15 / 26) * salary * completedYears;
		} else {
			// Formula: (15/30) * Last Drawn Basic Salary * Completed Years of Service
			// Years of service: Integer part only (no rounding up)
			const completedYears = Math.floor(tenure);
			gratuityValue = (15 / 30) * salary * completedYears;
		}

		// Cap Gratuity at Rs. 20 Lakhs (government standard limit)
		const cappedValue = Math.min(2000000, gratuityValue);

		setResult({
			rawGratuity: Math.round(gratuityValue),
			cappedGratuity: Math.round(cappedValue),
			isCapped: gratuityValue > 2000000,
			tenureCalculated: isCovered ? Math.round(tenure) : Math.floor(tenure)
		});
	};

	useEffect(() => {
		calculateGratuity();
	}, [basicSalary, yearsOfService, isCovered]);

	const copySummary = () => {
		if (!result) return;
		const summary = `Gratuity Calculation:\n- Basic Salary (+ DA): ₹${basicSalary}\n- Years of Service: ${yearsOfService} years\n- Act Covered: ${isCovered ? "Yes" : "No"}\n- Gratuity Amount: ₹${result.cappedGratuity.toLocaleString()}`;
		navigator.clipboard.writeText(summary);
		setCopied(true);
		toast.success("Gratuity details copied!");
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="w-full max-w-5xl mx-auto space-y-12 pb-24 animate-in">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
				{/* Inputs */}
				<div className="lg:col-span-7 space-y-6">
					<GlassCard className="p-8 space-y-6">
						<h3 className="text-2xl font-bold flex items-center gap-2 mb-4">
							<BriefcaseIcon className="text-primary w-6 h-6" />
							Service Details
						</h3>

						<div className="space-y-6">
							<div className="space-y-2">
								<label className="text-sm font-bold">Monthly Basic Salary + DA (₹)</label>
								<input
									type="number"
									value={basicSalary}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBasicSalary(e.target.value)}
									className="h-14 w-full rounded-2xl bg-muted/20 border border-border/40 px-6 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
								/>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-bold">Completed Years of Service</label>
								<input
									type="number"
									step="0.5"
									value={yearsOfService}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setYearsOfService(e.target.value)}
									className="h-14 w-full rounded-2xl bg-muted/20 border border-border/40 px-6 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
								/>
							</div>

							<div className="flex items-center justify-between p-4 rounded-xl bg-muted/10 border border-border/40">
								<div className="flex flex-col">
									<Label htmlFor="gratuity-act" className="font-bold text-base">Covered under Payment of Gratuity Act</Label>
									<span className="text-xs text-muted-foreground">Applies to companies with 10+ employees</span>
								</div>
								<Switch 
									id="gratuity-act" 
									checked={isCovered} 
									onCheckedChange={setIsCovered}
									className="scale-110"
								/>
							</div>
						</div>
					</GlassCard>
				</div>

				{/* Output Display */}
				<div className="lg:col-span-5 space-y-8">
					<GlassCard className="p-8 flex flex-col h-full justify-between">
						<div className="space-y-6">
							<div className="flex justify-between items-center">
								<span className="font-bold text-2xl">Gratuity Payout</span>
								<TrendingUpIcon className="text-primary w-6 h-6 animate-pulse" />
							</div>

							{result && (
								<div className="space-y-6">
									<div className="p-6 bg-primary/10 border border-primary/20 rounded-3xl text-center">
										<div className="text-4xl font-black text-primary font-mono">₹{result.cappedGratuity.toLocaleString()}</div>
										<div className="text-sm text-muted-foreground font-bold mt-2">Estimated Gratuity Payable</div>
									</div>

									{result.isCapped && (
										<div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl text-xs font-semibold">
											Calculated amount was ₹{result.rawGratuity.toLocaleString()} but capped at the government statutory limit of ₹20,00,000.
										</div>
									)}

									<div className="border-t border-border/40 pt-6 space-y-4">
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground font-medium">Completed Tenure:</span>
											<span className="font-bold text-foreground font-mono">{result.tenureCalculated} Completed Years</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground font-medium">Eligible Factor:</span>
											<span className="font-bold text-foreground font-mono">{isCovered ? "15 / 26 days salary" : "15 / 30 days salary"}</span>
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
										COPIED PAYOUT SUMMARY!
									</>
								) : (
									<>
										<CopyIcon className="w-5 h-5" />
										COPY DETAILS
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
