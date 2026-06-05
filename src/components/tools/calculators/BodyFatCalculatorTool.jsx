"use client";

import React, { useState, useEffect } from "react";
import { 
	ActivityIcon, 
	CopyIcon, 
	CheckCircleIcon,
	TrendingUpIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "../shared/WorkspaceComponents";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function BodyFatCalculatorTool() {
	const [gender, setGender] = useState("male");
	const [weight, setWeight] = useState("70");
	const [weightUnit, setWeightUnit] = useState("kg");
	const [height, setHeight] = useState("175");
	const [heightUnit, setHeightUnit] = useState("cm");
	const [waist, setWaist] = useState("80");
	const [neck, setNeck] = useState("38");
	const [hip, setHip] = useState("95"); // only female

	const [result, setResult] = useState(null);
	const [copied, setCopied] = useState(false);

	const calculateBodyFat = () => {
		const weightVal = parseFloat(weight);
		const heightVal = parseFloat(height);
		const waistVal = parseFloat(waist);
		const neckVal = parseFloat(neck);
		const hipVal = parseFloat(hip);

		if (
			isNaN(weightVal) || isNaN(heightVal) || isNaN(waistVal) || isNaN(neckVal) ||
			weightVal <= 0 || heightVal <= 0 || waistVal <= 0 || neckVal <= 0
		) {
			setResult(null);
			return;
		}

		// Convert everything to inches for US Navy Formula
		const hInches = heightUnit === "cm" ? heightVal / 2.54 : heightVal;
		const wInches = heightUnit === "cm" ? waistVal / 2.54 : waistVal;
		const nInches = heightUnit === "cm" ? neckVal / 2.54 : neckVal;
		const hipInches = heightUnit === "cm" ? hipVal / 2.54 : hipVal;

		let bf = 0;

		if (gender === "male") {
			// US Navy male formula:
			// BF% = 86.010 * log10(waist - neck) - 70.041 * log10(height) + 36.76
			const diff = wInches - nInches;
			if (diff <= 0) {
				setResult(null);
				return;
			}
			bf = 86.010 * Math.log10(diff) - 70.041 * Math.log10(hInches) + 36.76;
		} else {
			// US Navy female formula:
			// BF% = 163.205 * log10(waist + hip - neck) - 97.684 * log10(height) - 78.387
			if (isNaN(hipVal) || hipVal <= 0) {
				setResult(null);
				return;
			}
			const sum = wInches + hipInches - nInches;
			if (sum <= 0) {
				setResult(null);
				return;
			}
			bf = 163.205 * Math.log10(sum) - 97.684 * Math.log10(hInches) - 78.387;
		}

		const bfPercentage = Math.max(2, Math.min(60, bf));
		const fatMass = weightVal * (bfPercentage / 100);
		const leanMass = weightVal - fatMass;

		// Classify category
		let category = "Average";
		if (gender === "male") {
			if (bfPercentage < 6) category = "Essential Fat";
			else if (bfPercentage < 14) category = "Athletes";
			else if (bfPercentage < 18) category = "Fitness";
			else if (bfPercentage < 25) category = "Average";
			else category = "Obese";
		} else {
			if (bfPercentage < 14) category = "Essential Fat";
			else if (bfPercentage < 21) category = "Athletes";
			else if (bfPercentage < 25) category = "Fitness";
			else if (bfPercentage < 32) category = "Average";
			else category = "Obese";
		}

		setResult({
			bodyFat: parseFloat(bfPercentage.toFixed(1)),
			fatMass: parseFloat(fatMass.toFixed(1)),
			leanMass: parseFloat(leanMass.toFixed(1)),
			category,
			unit: weightUnit
		});
	};

	useEffect(() => {
		calculateBodyFat();
	}, [gender, weight, weightUnit, height, heightUnit, waist, neck, hip]);

	const copySummary = () => {
		if (!result) return;
		const summary = `Body Composition Projections:\n- Body Fat: ${result.bodyFat}%\n- Category: ${result.category}\n- Fat Mass: ${result.fatMass} ${result.unit}\n- Lean Mass: ${result.leanMass} ${result.unit}`;
		navigator.clipboard.writeText(summary);
		setCopied(true);
		toast.success("Metrics copied!");
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="w-full max-w-5xl mx-auto space-y-12 pb-24 animate-in">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
				{/* Inputs */}
				<div className="lg:col-span-7 space-y-6">
					<GlassCard className="p-8 space-y-6">
						<h3 className="text-2xl font-bold flex items-center gap-2 mb-4">
							<ActivityIcon className="text-primary w-6 h-6 animate-pulse" />
							Tape Measurements
						</h3>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
							<div className="space-y-2">
								<label className="text-sm font-bold">Gender</label>
								<Select value={gender} onValueChange={setGender}>
									<SelectTrigger className="h-12 rounded-xl bg-muted/20 font-bold border-border/40">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="rounded-xl border-border/40">
										<SelectItem value="male" className="rounded-lg">Male</SelectItem>
										<SelectItem value="female" className="rounded-lg">Female</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-bold">Weight</label>
								<div className="relative">
									<input
										type="number"
										value={weight}
										onChange={(e) => setWeight(e.target.value)}
										className="h-14 w-full rounded-2xl bg-muted/20 border border-border/40 px-6 pr-24 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
									/>
									<select
										value={weightUnit}
										onChange={(e) => setWeightUnit(e.target.value)}
										className="absolute right-3 top-3 h-8 rounded-lg bg-background border border-border/60 px-2 text-xs font-bold focus:outline-none"
									>
										<option value="kg">kg</option>
										<option value="lbs">lbs</option>
									</select>
								</div>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-bold">Height</label>
								<div className="relative">
									<input
										type="number"
										value={height}
										onChange={(e) => setHeight(e.target.value)}
										className="h-14 w-full rounded-2xl bg-muted/20 border border-border/40 px-6 pr-24 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
									/>
									<select
										value={heightUnit}
										onChange={(e) => setHeightUnit(e.target.value)}
										className="absolute right-3 top-3 h-8 rounded-lg bg-background border border-border/60 px-2 text-xs font-bold focus:outline-none"
									>
										<option value="cm">cm</option>
										<option value="inches">inches</option>
									</select>
								</div>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-bold">Neck Circumference ({heightUnit})</label>
								<input
									type="number"
									value={neck}
									onChange={(e) => setNeck(e.target.value)}
									className="h-14 w-full rounded-2xl bg-muted/20 border border-border/40 px-6 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
								/>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-bold">Waist Circumference ({heightUnit})</label>
								<input
									type="number"
									value={waist}
									onChange={(e) => setWaist(e.target.value)}
									className="h-14 w-full rounded-2xl bg-muted/20 border border-border/40 px-6 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
								/>
							</div>

							{gender === "female" && (
								<div className="space-y-2 animate-in">
									<label className="text-sm font-bold">Hip Circumference ({heightUnit})</label>
									<input
										type="number"
										value={hip}
										onChange={(e) => setHip(e.target.value)}
										className="h-14 w-full rounded-2xl bg-muted/20 border border-border/40 px-6 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
									/>
								</div>
							)}
						</div>
					</GlassCard>
				</div>

				{/* Output Display */}
				<div className="lg:col-span-5 space-y-8">
					<GlassCard className="p-8 flex flex-col h-full justify-between">
						<div className="space-y-6">
							<div className="flex justify-between items-center">
								<span className="font-bold text-2xl">Analysis</span>
								<TrendingUpIcon className="text-primary w-6 h-6 animate-pulse" />
							</div>

							{result && (
								<div className="space-y-6">
									<div className="p-6 bg-primary/10 border border-primary/20 rounded-3xl text-center">
										<div className="text-5xl font-black text-primary font-mono">{result.bodyFat}%</div>
										<div className="text-sm text-muted-foreground font-bold mt-2">Body Fat Percentage</div>
									</div>

									<div className="border-t border-border/40 pt-6 space-y-4">
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground font-medium">Category:</span>
											<span className="font-bold text-foreground">{result.category}</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground font-medium">Fat Mass:</span>
											<span className="font-bold text-foreground font-mono">{result.fatMass} {result.unit}</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground font-medium">Lean Mass:</span>
											<span className="font-bold text-foreground font-mono">{result.leanMass} {result.unit}</span>
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
										COPY METRICS
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
