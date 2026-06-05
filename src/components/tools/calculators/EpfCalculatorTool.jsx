"use client";

import React, { useState, useEffect } from "react";
import { 
	PiggyBankIcon, 
	CopyIcon, 
	CheckCircleIcon,
	TrendingUpIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "../shared/WorkspaceComponents";
import { toast } from "sonner";

export default function EpfCalculatorTool() {
	const [basicSalary, setBasicSalary] = useState("30000");
	const [currentAge, setCurrentAge] = useState("25");
	const [retirementAge, setRetirementAge] = useState("58");
	const [currentBalance, setCurrentBalance] = useState("100000");
	const [salaryIncrement, setSalaryIncrement] = useState("5"); // 5% yearly hike
	const [interestRate, setInterestRate] = useState("8.15"); // current EPFO rate

	const [result, setResult] = useState(null);
	const [copied, setCopied] = useState(false);

	const calculateEpf = () => {
		const salaryStart = parseFloat(basicSalary);
		const age = parseInt(currentAge, 10);
		const retire = parseInt(retirementAge, 10);
		const balanceStart = parseFloat(currentBalance) || 0;
		const hike = parseFloat(salaryIncrement) / 100;
		const rate = parseFloat(interestRate) / 100;

		if (
			isNaN(salaryStart) || isNaN(age) || isNaN(retire) || 
			salaryStart <= 0 || age <= 0 || retire <= age
		) {
			setResult(null);
			return;
		}

		let currentBalanceVal = balanceStart;
		let totalEmployeeContrib = 0;
		let totalEmployerContrib = 0;
		let totalInterest = 0;
		let currentSalary = salaryStart;

		const totalYears = retire - age;

		// Calculate EPF month by month
		for (let year = 0; year < totalYears; year++) {
			// Employer/Employee monthly contribution calculation
			// Standard Basic Salary cap for EPF is ₹15,000, but many companies calculate on actual basic.
			// Let's use the actual entered basic salary.
			
			// Employee Contribution: 12% of basic
			const monthlyEmployee = currentSalary * 0.12;
			// Employer Contribution: 3.67% to EPF (8.33% goes to EPS pension fund)
			const monthlyEmployer = currentSalary * 0.0367;

			let yearInterest = 0;
			for (let month = 0; month < 12; month++) {
				const monthlyContrib = monthlyEmployee + monthlyEmployer;
				currentBalanceVal += monthlyContrib;
				
				// EPF interest is compounded annually but calculated monthly on the running balance
				// Interest = Balance * (rate / 12)
				const monthlyInterest = currentBalanceVal * (rate / 12);
				yearInterest += monthlyInterest;
				
				totalEmployeeContrib += monthlyEmployee;
				totalEmployerContrib += monthlyEmployer;
			}
			
			currentBalanceVal += yearInterest;
			totalInterest += yearInterest;
			
			// Apply salary hike for the next year
			currentSalary *= (1 + hike);
		}

		setResult({
			totalAccumulated: Math.round(currentBalanceVal),
			employeeContribution: Math.round(totalEmployeeContrib),
			employerContribution: Math.round(totalEmployerContrib),
			interestEarned: Math.round(totalInterest)
		});
	};

	useEffect(() => {
		calculateEpf();
	}, [basicSalary, currentAge, retirementAge, currentBalance, salaryIncrement, interestRate]);

	const copySummary = () => {
		if (!result) return;
		const summary = `EPF Retirement Projection:\n- Retirement Corpus: ₹${result.totalAccumulated.toLocaleString()}\n- Your Contribution: ₹${result.employeeContribution.toLocaleString()}\n- Employer Contribution (EPF portion): ₹${result.employerContribution.toLocaleString()}\n- Interest Earned: ₹${result.interestEarned.toLocaleString()}`;
		navigator.clipboard.writeText(summary);
		setCopied(true);
		toast.success("EPF projection details copied!");
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="w-full max-w-5xl mx-auto space-y-12 pb-24 animate-in">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
				{/* Inputs */}
				<div className="lg:col-span-7 space-y-6">
					<GlassCard className="p-8 space-y-6">
						<h3 className="text-2xl font-bold flex items-center gap-2 mb-4">
							<PiggyBankIcon className="text-primary w-6 h-6" />
							EPF Inputs
						</h3>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
							<div className="space-y-2">
								<label className="text-sm font-bold">Monthly Basic Salary + DA (₹)</label>
								<input
									type="number"
									value={basicSalary}
									onChange={(e) => setBasicSalary(e.target.value)}
									className="h-14 w-full rounded-2xl bg-muted/20 border border-border/40 px-6 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
								/>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-bold">Current EPF Balance (₹)</label>
								<input
									type="number"
									value={currentBalance}
									onChange={(e) => setCurrentBalance(e.target.value)}
									className="h-14 w-full rounded-2xl bg-muted/20 border border-border/40 px-6 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
								/>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-bold">Current Age</label>
								<input
									type="number"
									value={currentAge}
									onChange={(e) => setCurrentAge(e.target.value)}
									className="h-14 w-full rounded-2xl bg-muted/20 border border-border/40 px-6 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
								/>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-bold">Retirement Age</label>
								<input
									type="number"
									value={retirementAge}
									onChange={(e) => setRetirementAge(e.target.value)}
									className="h-14 w-full rounded-2xl bg-muted/20 border border-border/40 px-6 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
								/>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-bold">Expected Annual Hike (%)</label>
								<input
									type="number"
									value={salaryIncrement}
									onChange={(e) => setSalaryIncrement(e.target.value)}
									className="h-14 w-full rounded-2xl bg-muted/20 border border-border/40 px-6 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
								/>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-bold">EPF Interest Rate (%)</label>
								<input
									type="number"
									step="0.05"
									value={interestRate}
									onChange={(e) => setInterestRate(e.target.value)}
									className="h-14 w-full rounded-2xl bg-muted/20 border border-border/40 px-6 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
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
								<span className="font-bold text-2xl">Accumulated Corpus</span>
								<TrendingUpIcon className="text-primary w-6 h-6 animate-pulse" />
							</div>

							{result && (
								<div className="space-y-6">
									<div className="p-6 bg-primary/10 border border-primary/20 rounded-3xl text-center">
										<div className="text-4xl font-black text-primary font-mono">₹{result.totalAccumulated.toLocaleString()}</div>
										<div className="text-sm text-muted-foreground font-bold mt-2">Retirement Corpus (at age {retirementAge})</div>
									</div>

									<div className="border-t border-border/40 pt-6 space-y-4">
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground font-medium">Your Total Contribution:</span>
											<span className="font-bold text-foreground font-mono">₹{result.employeeContribution.toLocaleString()}</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground font-medium">Employer Contribution:</span>
											<span className="font-bold text-foreground font-mono">₹{result.employerContribution.toLocaleString()}</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground font-medium">Total Interest Accrued:</span>
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
										COPIED EPF SUMMARY!
									</>
								) : (
									<>
										<CopyIcon className="w-5 h-5" />
										COPY PROJECTIONS
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
